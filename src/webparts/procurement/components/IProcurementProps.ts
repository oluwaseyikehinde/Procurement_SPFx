import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWebPartProps {
  context: WebPartContext;
}


export interface IProcurementProps {
  description: string;
  context: WebPartContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}