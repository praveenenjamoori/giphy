import {useEffect} from "react";
import {GifState} from "../context/gif-context";

import Gif from "../components/gif";
import FilterGif from "../components/filter-gif";

function Home() {
  const {gf, gifs, setGifs, filter} = GifState();

  const fetchTrendingGIFs = async () => {
    const {data: gifs} = await gf.trending({
      limit: 50,
      type: filter,
      rating: "g",
    });
    setGifs(gifs);
  };

  useEffect(() => {
    fetchTrendingGIFs();
  }, [filter]);

  return (
    <div className="flex gap-6">
      {/* Left Sidebar with Contributors - Desktop */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <p className="text-lg font-bold text-white mb-6">
              "Don't tell it to me, GIF it to me!"
            </p>
            
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Contributors
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://github.com/praveenenjamoori" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contributor-card flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer hover:scale-105"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    EP
                  </div>
                  <div>
                    <p className="font-medium text-white">Enjamoori Praveen Kumar</p>
                    <p className="text-sm text-gray-400">Developer</p>
                  </div>
                </a>
                
                <a 
                  href="https://github.com/Gbhanuteja22" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contributor-card flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer hover:scale-105"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    GB
                  </div>
                  <div>
                    <p className="font-medium text-white">Gummadavelli Bhanu Teja</p>
                    <p className="text-sm text-gray-400">Developer</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <img
          src="/banner.gif"
          alt="earth banner"
          className="mt-2 rounded w-full"
        />

        {/* Contributors Section - Mobile */}
        <div className="lg:hidden bg-gray-900 rounded-lg p-4 my-4">
          <p className="text-center text-lg font-bold text-white mb-4">
            "Don't tell it to me, GIF it to me!"
          </p>
          <div className="text-center">
            <h3 className="text-md font-semibold text-gray-300 mb-3">
              Contributors
            </h3>
            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/praveenenjamoori" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  EP
                </div>
                <p className="text-sm font-medium text-white">Enjamoori Praveen Kumar</p>
              </a>
              <a 
                href="https://github.com/Gbhanuteja22" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  GB
                </div>
                <p className="text-sm font-medium text-white">Gummadavelli Bhanu Teja</p>
              </a>
            </div>
          </div>
        </div>

        <FilterGif showTrending />

        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
          {gifs.map((gif) => (
            <Gif gif={gif} key={gif.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
