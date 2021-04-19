import ReactGA from 'react-ga'

let initialized: boolean = false;

export const initGA = () => {
  if (!initialized) {
    console.log('GA init')
    ReactGA.initialize('UA-11756963-5')
  }
  initialized = true
  return;
};

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
