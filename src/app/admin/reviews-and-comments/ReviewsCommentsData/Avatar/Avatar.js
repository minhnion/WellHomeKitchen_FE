export const Avatar = ({ name, size = "w-8 h-8" }) => {
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-yellow-500",
  ];

  const colorIndex = (name || "").length % colors.length;

  return (
    <div
      className={`${size} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
};
