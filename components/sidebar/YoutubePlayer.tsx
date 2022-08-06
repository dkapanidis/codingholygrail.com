import { useWindowSize } from "lib/hooks/windowSize";
import YouTube from "react-youtube";
import { AiOutlineClose } from 'react-icons/ai';

type YoutubePlayerProps = { videoId: string, cancel(): void }
function YoutubePlayer({ videoId, cancel }: YoutubePlayerProps) {
  const size = useWindowSize()
  const opts: { [x: string]: any } = {
    height: `${(size.height || 0) * 0.9}`,
    width: `${(size.width || 0) * 0.9}`,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (<div className={`fixed z-10 inset-0 overflow-y-auto`}>
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className={`fixed inset-0 transition-opacity`} aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75">
          <button type="button" className="fixed top-0 left-0 h-full w-full cursor-default outline-none" onClick={cancel}></button>
        </div>
        <AiOutlineClose fontSize="30" className="fixed top-3 right-3  cursor-pointer hover:text-gray-600" onClick={cancel} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block text-center overflow-hidden transform transition-all align-middle left-1/2 h-auto w-auto" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <YouTube videoId={videoId} opts={opts} />
        </div>
      </div>
    </div>
  </div>
  )
}
export default YoutubePlayer