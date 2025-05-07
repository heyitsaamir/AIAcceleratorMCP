1. Set up a clean Azure Function http trigger
2. Replace the azure function package.json dependency to "@azure/functions": "4.7.2-beta.0",
3. Update your http trigger to be an mcp trigger (like shown in the [handler](/src/index.ts))
4. In host.json, use extensionBundle.id should be `Microsoft.Azure.Functions.ExtensionBundle.Experimental`
5. Update local.settings.json to include GITHUB_TOKEN. This should be your PAT token.
5. Create an Azure Function in the Azure portal (don't do it from vscode, I had some issues with that)
6. Then go to VSCode, and deploy this to the created Azure Function
7. Check environment variables in the Azure portal to make sure GITHUB_TOKEN is set. If it isn't, set it manually.