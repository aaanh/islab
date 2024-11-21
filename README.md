# Inertial Sensing Lab Full-stack Website

## How to run locally

### Prerequisite tools

- Any code editor
- Git
- Node (>= 20.x) and npm

### Steps

- Clone this repository
- Change directory into the repository root
- Run `npm install`
- Create `.env.local` and add these environment variables
  ```
  # Created by Vercel CLI
  NEXT_PUBLIC_SANITY_DATASET="production"
  NEXT_PUBLIC_SANITY_PROJECT_ID="e8u26hts"

  ```
- Run `npm run dev`

## How to develop

- Create a new feature branch, e.g. `[your-name]/[some-feature-or-fix]`
- Make changes
- Add, commit, push
- Create new pull request from feature branch to `staging` branch
- Add @aaanh as reviewer
- If feature branch is diverged from `staging`, which prevents merging from PR, do `git checkout main; git pull; git checkout [your-feature-branch]; git rebase main`

## How the site is deployed

There are 2 live sites <https://islab.ca> and <https://staging.islab.ca>, each corresponding to `main` (production) and `staging` branch respectively.

Once new commits are pushed to any of these branches, Vercel will automatically trigger build and deploy to the said URLs.

## How to edit content

Most site contents are editable through the Sanity CMS Studio, which is accessible at <https://islab.ca/studio> or in local development environment, <http://localhost:3000/studio>.

### Documents (native concept)

Any content stored in Sanity CMS database are called documents. A document can fluidly take any shape or form depending on how it is defined in the `schemaType`.

A document must have a `slug` which is used for querying from the dabatase. Think of it as a unique ID.

### Categories

Categories are rendered in the application sidebar, acting as the entrypoint to the posts.

### Posts

A post is the content unit on the site. These are rendered at `/categories/post-slug/subpost-slug`.

A post may have children posts, called `subposts`, that are rendered at `/categories/post-slug/subpost-slug`

### Authors

Authors are rendered on the `/categories/people` page.

A post may or may not have an `author` referenced.
