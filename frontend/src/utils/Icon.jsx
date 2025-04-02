// External link icon
function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

// Chevron icon for expandable sections
function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

export const BoldIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      fill="#000000"
      height="18"
      width="18"
      version="1.1"
      id="Capa_1"
      viewBox="0 0 202 202"
      xml:space="preserve"
    >
      <path d="M148.004,94.812c18.332-8.126,28.671-23.362,28.671-42.752c0-17.261-6.954-31.206-20.11-40.328  C145.653,4.166,130.438,0,113.721,0H16.957v34h17v134h-17v34h90.905c14.819,0,35.992-2.245,52.705-12.94  c16.241-10.393,24.476-26.161,24.476-46.868C185.043,118.342,171.057,100.763,148.004,94.812z M103.12,80H73.957V34h26.096  c25.961,0,36.551,6.34,36.551,21.884C136.604,75.816,118.396,80,103.12,80z M73.957,115h30.838c28.537,0,40.177,7.436,40.177,25.663  c0,18.14-13.987,27.337-41.572,27.337H73.957V115z"></path>
    </svg>
  );
};
