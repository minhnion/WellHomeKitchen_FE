export const StarRating = ({ rating, size = "text-sm" }) => {
  return (
    <div className={`flex items-center gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-gray-600 text-xs">({rating})</span>
    </div>
  );
};
