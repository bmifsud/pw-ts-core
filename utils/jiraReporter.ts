import type {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

class JiraReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed' || result.status === 'timedOut') {
      const isMockApi = process.env.MOCK_API === 'true';
      const jiraUrl = isMockApi ? 'https://mock-jira.atlassian.net' : (process.env.JIRA_URL || '');
      const jiraToken = process.env.JIRA_TOKEN;
      const jiraEmail = process.env.JIRA_EMAIL;

      if (!jiraUrl) {
        console.warn('Jira URL not configured, skipping Jira bug logging.');
        return;
      }

      console.log(`\n[JiraReporter] Test failed: ${test.title}. Logging bug to Jira...`);

      const summary = `[Automated Test Failure] ${test.title}`;
      let description = `Test Failed: ${test.title}\n\n`;

      if (result.error?.message) {
        description += `*Error Message:*\n{code}\n${result.error.message}\n{code}\n\n`;
      }
      if (result.error?.stack) {
         description += `*Stack Trace:*\n{code}\n${result.error.stack}\n{code}\n`;
      }

      const payload = {
        fields: {
          project: {
            key: process.env.JIRA_PROJECT_KEY || 'BUG' // Fallback for mocking
          },
          summary: summary.substring(0, 255), // Jira limit
          description: description,
          issuetype: {
            name: 'Bug'
          }
        }
      };

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (!isMockApi && jiraEmail && jiraToken) {
           headers['Authorization'] = `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64')}`;
        }

        const response = await axios.post(`${jiraUrl}/rest/api/2/issue`, payload, {
          headers: headers
        });

        console.log(`[JiraReporter] Successfully created Jira bug: ${response.data.key}`);

        // Note: In a real implementation, you would attach screenshots/traces here
        // using the Jira attachments API (POST /rest/api/2/issue/{issueIdOrKey}/attachments)
        // iterating through result.attachments
        if (result.attachments.length > 0) {
           console.log(`[JiraReporter] Attachments to be uploaded: ${result.attachments.map(a => a.name).join(', ')}`);
        }

      } catch (error: any) {
        console.error(`[JiraReporter] Failed to create Jira bug:`, error.message);
        if (error.response) {
            console.error(`[JiraReporter] API Response:`, JSON.stringify(error.response.data, null, 2));
        }
      }
    }
  }
}

export default JiraReporter;
