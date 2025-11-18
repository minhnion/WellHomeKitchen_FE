const ContentViewerDetail = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-sm font-medium">Không có nội dung</p>
      </div>
    );
  }

  return (
    <div className="content-viewer overflow-hidden rounded-lg shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giá trị
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentViewerDetail;
