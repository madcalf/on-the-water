export const getCurrentsIcon = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" stroke="none" fill="none" class="bi bi-arrow-up" viewBox="0 0 16 16">
  
  <g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
  <g id="arrow-up" fill="#FFFFFF" fill-rule="nonzero" stroke="#000000" stroke-width="0.5">
  
  <path transform-origin="center bottom" fill-rule="nonzero" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></g> </g>
</svg>`;
};

export const getPoiIcon = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <image id="kayak_marker" x="0" y="0" width="25" height="25" xlink:href="data:image/png;base64,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"></image>
    </g>
</svg>`;
};

export const getHamburgerIcon = () => {
  return ` <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 30 30"
  width="30"
  height="30"
  focusable="false"
>
  <title>Menu</title>
  <path
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeMiterlimit="10"
    d="M4 7h22M4 15h22M4 23h22"
  />
</svg>`;
};

export const getTidesIcon = () => {
  return `<svg height="50" viewBox="0 0 50 50" width="50" xmlns="http://www.w3.org/2000/svg"><g><path d="m126.25 83.452c-10.376 0-10.376 6-20.752 6s-10.377-6-20.753-6-10.375 6-20.749 6-10.375-6-20.749-6-10.374 6-20.749 6-10.374-6-20.748-6v-16.394c10.374 0 10.374 6 20.748 6s10.375-6 20.749-6 10.374 6 20.749 6 10.374-6 20.749-6 10.376 6 20.753 6 10.376-6 20.752-6z" fill="#beebfa"/><path d="m126.25 99.845c-10.376 0-10.376 6-20.752 6s-10.377-6-20.753-6-10.375 6-20.749 6-10.375-6-20.749-6-10.374 6-20.749 6-10.374-6-20.748-6v-16.393c10.374 0 10.374 6 20.748 6s10.375-6 20.749-6 10.374 6 20.749 6 10.374-6 20.749-6 10.376 6 20.753 6 10.376-6 20.752-6z" fill="#9ee2f8"/><path d="m1.75 126.247v-26.4c10.374 0 10.374 6 20.748 6s10.375-6 20.749-6 10.374 6 20.749 6 10.374-6 20.749-6 10.376 6 20.753 6 10.376-6 20.752-6v26.4z" fill="#0d91bd"/><path d="m39.464 27.783 24.598 24.598 24.599-24.598-7.072-7.072-12.527 12.527v-31.491h-10v31.491l-12.526-12.527z" fill="#09607d"/></g></svg>`;
};
