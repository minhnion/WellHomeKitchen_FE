import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";

export const NewsCard = ({ coverImage, title, excerpt, date }) => {
  return (
    <div className="h-full w-full rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[6/4] overflow-hidden rounded-lg">
        <Image
          src={new URL(coverImage, API_BASE_URL).href}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mb-2">{date}</p>

        <p
          className="text-sm text-gray-700 flex-1 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {excerpt}
        </p>
      </div>
    </div>
  );
};
