# Poodr

Poodr helps you quickly organize Slack channels into small groups. You tell it what channels and usergroups you want to include in the groups, it makes the groups, you finetune them, and then it sends a direct message to the groups to notify them. It also sends you a direct message including a description of all the groups created. It tracks the history of your groups (Unless you tell it not to) and creates groups that favor new pairings.

## How to use in production

1. Navigate to https://poodr.herokuapp.com
2. Sign in with your Slack credentials (You will need team privileges to add integrations)
3. Choose the grouping options you want to use
4. Choose the channels and usergroups you want to include
5. Click 'Make Groups'
**On the next screen**
1. Click and drag members to rearrange them
2. Click on a member to disable her
3. Write a custom notification message if you desire
4. Click 'Notify members'

The groups will receive a direct message, and you will receive a groups report as a direct message from the app. 

## How to setup in development

### Prerequisites
You need a [Slack app](https://api.slack.com/slack-apps) and you need [Groopr](https://github.com/samlandfried/groopr-rails) running on a separate port (The `.env` file below expects it to be running on port 8080).

1. Clone this repo
2. `cd` into the project root
3. `npm install`
4. Add a `.env.development.local` file to your project root and populate it with your Slack app credentials. Here's mine w/ fake values.

```bash
REACT_APP_SLACK_CLIENT_ID=678901234.12344567
REACT_APP_SLACK_SECRET=12101986
REACT_APP_SLACK_CALLBACK=http://localhost:3000/callback
REACT_APP_BOT_TOKEN=xoxb-abcdefghijklmonp...
REACT_APP_USER_TOKEN=xoxp-123456789...
REACT_APP_ROOT_PATH=http://localhost:3000
REACT_APP_GROOPR_PATH=http://localhost:8080
```

5. `npm start`
6. Visit `http://localhost:3000` in your browser.