/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { Base } from '../../base';
import { formInputDebounceTime } from '../../constants';
import { SessionQuery } from '../../session/session.query';
import { CheckerWorkflowQuery } from '../../state/checker-workflow.query';
import { CheckerWorkflowService } from '../../state/checker-workflow.service';
import { DockstoreTool } from '../../swagger/model/dockstoreTool';
import { Entry } from '../../swagger/model/entry';
import { Workflow } from '../../swagger/model/workflow';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../validationMessages.model';
import { DescriptorLanguageService } from '../descriptor-language.service';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';
import { AlertQuery } from '../../alert/state/alert.query';

@Component({
  selector: 'app-register-checker-workflow',
  templateUrl: './register-checker-workflow.component.html',
  styleUrls: ['./register-checker-workflow.component.scss']
})
export class RegisterCheckerWorkflowComponent extends Base implements OnInit, AfterViewChecked {

  constructor(private registerCheckerWorkflowService: RegisterCheckerWorkflowService,
    private checkerWorkflowService: CheckerWorkflowService, private alertQuery: AlertQuery,
    private descriptorLanguageService: DescriptorLanguageService, private sessionQuery: SessionQuery,
    private checkerWorkflowQuery: CheckerWorkflowQuery) {
      super();
    }
  public registerError: HttpErrorResponse;
  public isModalShown$: Observable<boolean>;
  public workflowPath: string;
  public testParameterFilePath: string;
  public syncTestJson: boolean;
  public formErrors = formErrors;
  public validationDescriptorPatterns = validationDescriptorPatterns;
  public validationMessages = validationMessages;
  public isRefreshing$: Observable<boolean>;
  public mode$: Observable<'add' | 'edit'>;
  public descriptorType: string;
  public descriptorLanguages: Array<string>;
  private entry: Entry;
  registerCheckerWorkflowForm: NgForm;
  isWorkflow = false;
  @ViewChild('registerCheckerWorkflowForm') currentForm: NgForm;

  ngOnInit() {
    this.clearForm();
    this.checkerWorkflowQuery.entry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entry: Entry) => {
      this.entry = entry;
      if (entry) {
        this.testParameterFilePath = this.getTestParameterFileDefault(entry, this.descriptorType);
        this.isWorkflow = this.checkerWorkflowQuery.isEntryAWorkflow(entry);
        if (this.isWorkflow) {
          this.descriptorType = (<Workflow>this.entry).descriptorType;
        }
      } else {
        this.testParameterFilePath = null;
        this.isWorkflow = null;
        this.descriptorType = null;
      }
    });
    this.mode$ = this.registerCheckerWorkflowService.mode$;
    this.isModalShown$ = this.registerCheckerWorkflowService.isModalShown$;
    this.syncTestJson = false;
    this.descriptorLanguageService.descriptorLanguages$.subscribe((descriptorLanguages: Array<string>) => {
      this.descriptorLanguages = descriptorLanguages.filter((language: string) => language.toLowerCase() !== 'nfl');
    });
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }

  private clearForm(): void {
    this.workflowPath = '';
    this.testParameterFilePath = '';
    this.descriptorType = 'cwl';
  }

  /**
   * Gets the test parameter file from the current entry
   *
   * @private
   * @param {Entry} entry The current entry
   * @param {string} descriptorType The descriptor type currnetly selected in the form
   * @returns {string} The default test parameter file to populate the form
   * @memberof RegisterCheckerWorkflowComponent
   */
  private getTestParameterFileDefault(entry: Entry, descriptorType: string): string {
    if (this.isWorkflow) {
      return (<Workflow>entry).defaultTestParameterFilePath;
    } else {
      switch (descriptorType) {
        case 'cwl': {
          return (<DockstoreTool>entry).defaultCWLTestParameterFile;
        }
        case 'wdl': {
          return (<DockstoreTool>entry).defaultWDLTestParameterFile;
        }
        default: {
          return '';
        }
      }
    }
  }

  hideModal(): void {
    this.registerCheckerWorkflowService.isModalShown$.next(false);
  }

  registerCheckerWorkflow(): void {
    this.registerCheckerWorkflowService.registerCheckerWorkflow(this.workflowPath, this.testParameterFilePath, this.descriptorType);
  }

  /**
   * Handles the event where the descriptor type in the form has changed
   * @param descriptorType The descriptor type current selected in the form
   */
  public onDescriptorTypeChange(descriptorType: string): void {
    this.testParameterFilePath = this.getTestParameterFileDefault(this.entry, descriptorType);
  }

  // Validation starts here, should move most of these to a service somehow
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged(): void {
    if (this.currentForm === this.registerCheckerWorkflowForm) { return; }
    this.registerCheckerWorkflowForm = this.currentForm;
    if (this.registerCheckerWorkflowForm) {
      this.registerCheckerWorkflowForm.valueChanges.pipe(debounceTime(formInputDebounceTime))
        .subscribe(data => this.onValueChanged(data));
    }
  }
  onValueChanged(data?: any): void {
    if (!this.registerCheckerWorkflowForm) { return; }
    const form = this.registerCheckerWorkflowForm.form;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  // Validation ends here

}
