/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';

import { EntryTab } from '../../shared/entry/entry-tab';
import { WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

@Component({
  selector: 'app-tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.css']
})
export class ToolTabComponent extends EntryTab {
  workflow: Workflow;
  toolsContent: string = null;
  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this.workflowService.workflow$.pipe(first()).subscribe((workflow: Workflow) => {
        this.workflow = workflow;
        if (workflow) {
          this.updateTableToolContent(workflow.id, value.id);
        } else {
          console.error('Should not be able to select version without a workflow');
        }
      }, error => {
        console.error('Something has gone terribly wrong with the workflow$ observable.');
      });
    } else {
      this.toolsContent = null;
    }
  }
  constructor(private workflowService: WorkflowService, private workflowsService: WorkflowsService) {
    super();
  }

  /**
   * Update the table tool contents for the current workflow and workflow version
   *
   * @param {number} workflowId  The workflow Id
   * @param {number} versionId   The workflowVersion Id
   * @memberof ToolTabComponent
   */
  updateTableToolContent(workflowId: number, versionId: number): void {
    if (workflowId && versionId) {
      this.workflowsService.getTableToolContent(workflowId, versionId).subscribe(
        (toolContent) => {
          this.toolsContent = toolContent;
        }, error => {
          console.log('Could not retrieve table tool content');
          this.toolsContent = null;
        });
    } else {
      this.toolsContent = null;
    }
  }
}
