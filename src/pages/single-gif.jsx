import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {GifState} from "../context/gif-context";
import Gif from "../components/gif";
import FollowOn from "../components/follow-on";

import {HiOutlineExternalLink} from "react-icons/hi";
import {HiMiniChevronDown, HiMiniChevronUp, HiMiniHeart} from "react-icons/hi2";
import {FaPaperPlane} from "react-icons/fa6";
import {HiArrowDownTray} from "react-icons/hi2";

const contentType = ["gifs", "stickers", "texts"];

const GifPage = () => {
  const {type, slug} = useParams();
  const [gif, setGif] = useState({});
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const {gf, addToFavorites, favorites} = GifState();

  useEffect(() => {
    if (!contentType.includes(type)) {
      throw new Error("Invalid Content Type");
    }
    const fetchGif = async () => {
      const gifId = slug.split("-");
      const {data} = await gf.gif(gifId[gifId.length - 1]);
      const {data: related} = await gf.related(gifId[gifId.length - 1], {
        limit: 10,
      });
      setGif(data);
      setRelatedGifs(related);
    };

    fetchGif();
  }, []);

  const shareGif = async () => {
    const gifUrl = gif?.images?.original?.url;
    if (!gifUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: gif.title || 'GIF',
          text: 'Check out this GIF!',
          url: gifUrl,
        });
      } catch (err) {
        // User cancelled or sharing failed
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(gifUrl);
        alert('GIF link copied to clipboard!');
      } catch (err) {
        alert('Could not copy GIF link.');
      }
    }
  };

  const DownloadGif = () => {
    if (!gif?.images?.original?.url) return;
    
    setIsDownloading(true);
    setDownloadComplete(false);
    
    fetch(gif.images.original.url)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${gif.title || 'giphy-gif'}.gif`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        
        // Show download complete animation
        setIsDownloading(false);
        setDownloadComplete(true);
        
        // Reset after animation
        setTimeout(() => {
          setDownloadComplete(false);
        }, 2000);
      })
      .catch(() => {
        setIsDownloading(false);
      });
  };

  return (
    <div className="grid grid-cols-4 my-10 gap-4">
      <div className="hidden sm:block">
        {gif?.user && (
          <>
            <div className="flex gap-1">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="faded-text">@{gif?.user?.username}</div>
              </div>
            </div>
            {gif?.user?.description && (
              <p className="py-4 whitespace-pre-line text-sm text-gray-400">
                {readMore
                  ? gif?.user?.description
                  : gif?.user?.description.slice(0, 100) + "..."}
                <div
                  className="flex items-center faded-text cursor-pointer"
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? (
                    <>
                      Read less <HiMiniChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Read more <HiMiniChevronDown size={20} />
                    </>
                  )}
                </div>
              </p>
            )}
          </>
        )}
        <FollowOn />
        <div className="divider" />

        {gif?.source && (
          <div>
            <span
              className="faded-text" //custom - faded-text
            >
              Source
            </span>
            <div className="flex items-center text-sm font-bold gap-1">
              <HiOutlineExternalLink size={25} />
              <a href={gif.source} target="_blank" className="truncate">
                {gif.source}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          <div className="w-full sm:w-3/4">
            <div className="faded-text truncate mb-2">{gif.title}</div>
            <Gif gif={gif} hover={false} />

            {/* -- Mobile UI -- */}
            <div className="flex sm:hidden gap-1">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="faded-text">@{gif?.user?.username}</div>
              </div>

              <button className="ml-auto" onClick={shareGif}>
                <FaPaperPlane size={25} />
              </button>
            </div>
            {/* -- Mobile UI -- */}
          </div>

          <div className="hidden sm:flex flex-col gap-5 mt-6">
            <button
              onClick={() => addToFavorites(gif.id)}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gif.id) ? "text-red-500" : ""
                }`}
              />
              Favorite
            </button>
            <button
              onClick={shareGif} 
              className="flex gap-6 items-center font-bold text-lg"
            >
              <FaPaperPlane size={25} />
              Share
            </button>
            <button
              onClick={DownloadGif} 
              className={`flex gap-5 items-center font-bold text-lg transition-all duration-300 ${
                isDownloading ? 'text-blue-400 animate-pulse' : 
                downloadComplete ? 'text-green-400 download-success' : ''
              }`}
              disabled={isDownloading}
            >
              <div className="relative">
                <HiArrowDownTray 
                  size={30} 
                  className={`transition-all duration-300 ${
                    isDownloading ? 'animate-bounce' : 
                    downloadComplete ? 'text-green-400' : ''
                  }`}
                />
                {downloadComplete && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                )}
                {isDownloading && (
                  <div className="absolute inset-0 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              {isDownloading ? 'Downloading...' : downloadComplete ? 'Downloaded!' : 'Download'}
            </button>
          </div>
        </div>

        <div>
          <span className="font-extrabold">Related GIFs</span>
          <div className="columns-2 md:columns-3 gap-2">
            {relatedGifs.slice(1).map((gif) => (
              <Gif gif={gif} key={gif.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifPage;
