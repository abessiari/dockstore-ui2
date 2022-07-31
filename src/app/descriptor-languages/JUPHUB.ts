import { ExtendedDescriptorLanguageBean } from 'app/entry/extendedDescriptorLanguage';
import { SourceFile, ToolDescriptor, Workflow } from 'app/shared/swagger';

export const extendedJUPHUB: ExtendedDescriptorLanguageBean = {
  descriptorLanguageEnum: 'JUPHUB',
  value: 'JUPHUB',
  shortFriendlyName: 'JUPHUB',
  friendlyName: 'Binder Environment',
  defaultDescriptorPath: '/juphub.json',
  descriptorPathPattern: '^/([^/?:*|<>]+/)*[^/?:*|<>]+.(json|yaml|yml)',
  descriptorPathPlaceholder: 'e.g. /juphub.json',
  toolDescriptorEnum: ToolDescriptor.TypeEnum.JUPHUB,
  workflowDescriptorEnum: Workflow.DescriptorTypeEnum.JUPHUB,
  languageDocumentationURL: 'https://jupyter.org/hub',
  plainTRS: 'PLAIN-JUPHUB',
  descriptorFileTypes: [SourceFile.TypeEnum.JUPHUBCONFIG],
  toolTab: {
    rowIdentifier: 'tool\xa0ID',
    workflowStepHeader: 'Tool Excerpt',
  },
  workflowLaunchSupport: true,
  testParameterFileType: SourceFile.TypeEnum.NOTEBOOK,
  fileTabs: [
    {
      tabName: 'Environment Files',
      fileTypes: [SourceFile.TypeEnum.JUPHUBCONFIG],
    },
    {
      tabName: 'Notebooks',
      fileTypes: [SourceFile.TypeEnum.NOTEBOOK],
    },
    { tabName: 'Configuration', fileTypes: [SourceFile.TypeEnum.JUPHUBCONFIG] },
  ],
};
