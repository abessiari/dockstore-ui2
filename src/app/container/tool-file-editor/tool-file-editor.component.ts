import { Component, Input } from '@angular/core';
import { FileEditing } from '../../shared/file-editing';
import { Tag } from './../../shared/swagger/model/tag';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { ContainerService } from './../../shared/container.service';
import { RefreshService } from './../../shared/refresh.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { AlertService } from '../../shared/alert/state/alert.service';

@Component({
  selector: 'app-tool-file-editor',
  templateUrl: './tool-file-editor.component.html',
  styleUrls: ['./tool-file-editor.component.scss']
})
export class ToolFileEditorComponent extends FileEditing {
  dockerFile = [];
  descriptorFiles = [];
  testParameterFiles = [];
  originalSourceFiles = [];
  currentVersion: Tag;
  selectedDescriptorType = 'cwl';
  isNewestVersion = false;
  @Input() entrypath: string;
  @Input() set selectedVersion(value: Tag) {
      this.currentVersion = value;
      this.isNewestVersion = this.checkIfNewestVersion();
      this.editing = false;
      this.clearSourceFiles();
      if (value != null) {
        // Fix the JSON.parse later.  Currently used to deep copy values but not keep the read-only attribute of state management.
        this.originalSourceFiles =  JSON.parse(JSON.stringify(value.sourceFiles));
        this.loadVersionSourcefiles();
      }
  }

  constructor(private hostedService: HostedService, private containerService: ContainerService, private refreshService: RefreshService,
    private alertService: AlertService) {
    super();
  }

  checkIfNewestVersion(): boolean {
    if (!this.versions || this.versions.length === 0) {
      return true;
    }
    const mostRecentId = this.versions.reduce((max, n) => Math.max(max, n.id), this.versions[0].id);
    return this.currentVersion.id === mostRecentId;
  }

  /**
   * Fix the JSON.parse later.  Currently used to deep copy values but not keep the read-only attribute of state management.
   * Splits up the sourcefiles for the version into descriptor files and test parameter files
   */
  loadVersionSourcefiles(): void {
    this.descriptorFiles = JSON.parse(JSON.stringify(this.getDescriptorFiles(this.currentVersion.sourceFiles)));
    this.testParameterFiles = JSON.parse(JSON.stringify(this.getTestFiles(this.currentVersion.sourceFiles)));
    this.dockerFile = JSON.parse(JSON.stringify(this.getDockerFile(this.currentVersion.sourceFiles)));
  }

  /**
   * Combines sourcefiles into one array
   * @return {Array<SourceFile>} Array of sourcefiles
   */
  getCombinedSourceFiles(): Array<SourceFile> {
    let baseFiles = [];
    if (this.descriptorFiles) {
      baseFiles = baseFiles.concat(this.descriptorFiles);
    }
    if (this.testParameterFiles) {
      baseFiles = baseFiles.concat(this.testParameterFiles);
    }
    if (this.dockerFile) {
      baseFiles = baseFiles.concat(this.dockerFile);
    }
    return baseFiles;
  }

  /**
   * Creates a new version based on changes made
   */
  saveVersion(): void {
    const message = 'Save Version';
    const combinedSourceFiles = this.getCombinedSourceFiles();
    const newSourceFiles = this.commonSaveVersion(this.originalSourceFiles, combinedSourceFiles);
    this.alertService.start('Editing hosted tool');
    this.hostedService.editHostedTool(
        this.id,
        newSourceFiles).subscribe(result => {
          this.toggleEdit();
          this.containerService.setTool(result);
          this.alertService.detailedSuccess();
        }, error =>  {
          if (error) {
            this.alertService.detailedError(error);
          }
        }
      );
  }

  /**
   * Resets the files back to their original state
   */
  resetFiles(): void {
    this.descriptorFiles = this.getDescriptorFiles(this.originalSourceFiles);
    this.testParameterFiles = this.getTestFiles(this.originalSourceFiles);
    this.dockerFile = this.getDockerFile(this.originalSourceFiles);
  }

  /**
   * Clear the sourcefiles stored
   */
  clearSourceFiles() {
    this.dockerFile = [];
    this.descriptorFiles = [];
    this.testParameterFiles = [];
    this.originalSourceFiles = [];
  }


}
