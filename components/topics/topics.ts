import Topic from "./Topic";

const topics: { [key: string]: Topic } = {
  "golang": {
    id: 'golang',
    text: 'Go',
    description: 'Go is the de facto language of cloud native, popularized by its use on Docker and Kubernetes.',
    icon: '/assets/topics/golang.svg',
  },
  "react": {
    id: 'react',
    text: 'React',
    description: 'React is a javascript library for building user interfaces built by facebook.',
    icon: '/assets/topics/react.svg',
  },
  "terminal": {
    id: 'terminal',
    text: 'Terminal',
    description: 'Tips & tricks on how to tune the terminal to boost your productivity.',
    icon: '/assets/topics/terminal.svg',
  },
  "kubernetes": {
    id: 'kubernetes',
    text: 'Kubernetes',
    description: 'Kubernetes is the de facto platform for running containerized workload on the cloud or your own bare metal.',
    icon: '/assets/topics/kubernetes.svg',
  }
}

export default topics