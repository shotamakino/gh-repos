## Getting Started

1. Clone the repository to your local machine.
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
   5. Input a token name (eg. "personal")
   6. Select *7 days* for *Expiration*
   7. Select **All repositories** under **Repository access**
   8. Under **Permissions**, you will find **Repository permissions** 
      . Click the arrow on the right hand side to expand the line item.
   9. In the expanded list, you will find **Metadata**.
      Select **Read-only** for its **Access** value.
   10. Leave all other options as-is and click **Generate token** at the bottom of the form.
1. Copy the generated access token and paste it into the `.env.local`
   you created in *step 1*.
1. Run `pnpm install` and then `pnpm dev` in the root of the repository.
1. Once the app builds, go to `localhost:3000` in your browser
1. On the top right side, you can click on the text input to
   search for some repositories. Cheers!


## Todos (if I had more time)
- Make a mock of GitHub api to use for testing
- Unit test route handler logic (with MSW for e2e)
- Unit test more of the api server logic
- Fix jarring loading behavior of table
- Better design for filter selection and edit 
- Surface filter at table level to show presence of filters
- Add more data points to the table
- Incorporate more filters available to the search repos API

## Deployment Notes
1. Security as it stands is premature. A full OAuth flow can
   and likely is better to be implemented so that this can
   be hosted as a shared application. In order to do this,
   we would need to save state of user's tokens and add in
   refresh token logic. Thus we would require a three-tier
   solution with a relational database sitting behind our
   api server.
2. Frontend code can be self-hosted (not on Vercel) via
   Kubernetes deployment and a nextjs server running in a
   container
3. We might want to cache the results from the GitHub API so
   that we limit our API usage. We could do this for any
   public repositories, but we would require a user-specific cache
   if we did anything that required user-level
   authorization. This might require the use of a fast nosql
   solution like a KV store commonly found in redis.
3. In order to better utilize text search functionality
   beyond that provided by GitHub, we might want to store
   some of the data in Elasticsearch or Opensearch. This
   would allow us to better control ranking and the way we
   might pre-process (n-grams) our tokens.
4. Based on the read usage of the table and how users mostly
   queries the data, we might want to denormalize the data
   so that we can serve common and high-traffic queries
   faster and cheaply.
5. I would like to try our terraform but I would likely
   stick with AWS to first prototype the infrastructure in a
   more familiar language (CDK). Also, tracing and other
   facilities provided by sticking with one provider might
   be more helpful in instrumenting our servers 