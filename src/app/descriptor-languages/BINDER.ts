import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedBINDER: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'BINDER',
  value: 'BINDER',
  shortFriendlyName: 'BINDER',
  friendlyName: 'Binder Environment',
  defaultDescriptorPath: '/requirements.txt',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(txt|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /requirements.txt',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.BINDER,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.BINDER,
  languageDocumentationURL: 'https://jupyter.org/binder',
  plainTRS: 'PLAIN-BINDER',
  descriptorFileTypes: [SourceFile.TypeEnum.BINDERCONFIG],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.NOTEBOOK,
  fileTabs: [
    {
      tabName: 'Environment Files',
      fileTypes: [SourceFile.TypeEnum.BINDERCONFIG],
    },
    {
      tabName: 'Notebooks',
      fileTypes: [SourceFile.TypeEnum.NOTEBOOK],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.BINDERCONFIG] },
  ],
};
