## Getting Started

1. Copy the env.local and rename to .env.local 
   ```bash
   cp env.local .env.local
   ```
1. [Create a personal access token for your GitHub account](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)
   1. Click **Settings** in the drop down from your profile
      photo on GitHub.
   2. In the left sidebar go to **Developer Settings**
   3. in the left sidebar Under **Personal access tokens**
      click **Fine-grained tokens**
   4. Click **Generate new token**
   5. Input a token name (eg. "AxionRay Tech Screen")
   6. Select *7 days* for *Expiration*
   7. Select **All repositories** under **Repository access**
   8. Under **Permissions**, you will find **Repository permissions** 
      . Click the arrow on the right hand side to expand the line item.
   9. In the expanded list, you will find **Metadata**.
      Select **Read-only** for its **Access** value.
   10. Leave all other options as-is and click **Generate token** at the bottom of the form.
1. Copy the generated access token and paste it into the `.env.local`
   you created in *step 1*.
1. Run `pnpm install` and then `pnpm dev`

## Notes
I defined an API for better shaping the frontend to take a
single input and return the results uniformly. This led to
some constraints in design choices.

Because of turning 3 GitHub REST APIs into 1 endpoint for
our API  and has been coded so that it can be
refactored into separate API resources. You may encounter
some redundancies, but those redundancies are there to save
time in the future to act as an adapter between GitHub's API
with ours.

## Todos
- Make a mock of GitHub api to use for testing
- Unit test route handler logic
- 