import Video from "./Video";

const videos: Video[] = [
  {
    title: "React in Docker & Kubernetes walkthrough: Multistage build, push & deploy in Kubernetes",
    content: "https://www.youtube.com/watch?v=e1xuKr8mOcg",
    thumbnail: "https://i2.ytimg.com/vi/e1xuKr8mOcg/hqdefault.jpg",
    description: `Hi everyone, in this video I'll walk you through how to build a react app in a docker container the **right** way, using the official "node" image from docker hub, alpine OS for super lightweight containers, multi-stage builds (or otherwise builder pattern) to separate build and runtime, and finally pushing the image to a remote registry and deploy it in a kubernetes cluster. We'll be using our working slack-clone example we prepared on previous video. Code: https://github.com/dkapanidis/react-workshop-slack Twitter: https://twitter.com/dkapanidis Twitch: https://www.twitch.tv/dkapanidis Make sure to check the slack-clone live coding session at https://www.youtube.com/watch?v=7ZMtfmjgQ7U If you like the video please subscribe to this channel! Chapters: 0:00 Intro 0:30 Deploy to Firebase Hosting 1:28 Build Docker Image 13:20 Push to Registry 13:57 Deploy to Kubernetes 16:13 Outro #react #docker #kubernetes`,
    published: '2021-04-06',
  },
  {
    title: "Building Slack clone using React, TailwindCSS & Supabase",
    content: "https://www.youtube.com/watch?v=aioc_cqob2U",
    thumbnail: "https://i2.ytimg.com/vi/aioc_cqob2U/hqdefault.jpg",
    description: `In the previous video we built a Slack clone from scratch using Firebase. Now we take the Slack clone and migrate it to use Supabase instead, an open-source firebase alternative. Starting code: http://github.com/dkapanidis/react-workshop-slack Final code: https://github.com/dkapanidis/react-workshop-slack-supabase In next videos we'll be preparing the slack clone for a self-hosted solution on Kubernetes.`,
    published: '2021-04-01',
  },
  {
    title: "Live coding a Slack clone from scratch using React, TailwindCSS & Firebase",
    content: "https://www.youtube.com/watch?v=7ZMtfmjgQ7U",
    thumbnail: "https://i4.ytimg.com/vi/7ZMtfmjgQ7U/hqdefault.jpg",
    description: `Building a Slack clone from scratch using create-react-app, tailwindCSS and Firebase! Repo: [https://github.com/dkapanidis/react-workshop-slack](https://github.com/dkapanidis/react-workshop-slack) Twitter: [https://twitter.com/dkapanidis](https://twitter.com/dkapanidis) -- Watch live at https://www.twitch.tv/dkapanidis`,
    published: '2021-04-01',
  }
]

export default videos