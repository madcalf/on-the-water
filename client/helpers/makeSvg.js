// returns the following svg data with a unique id inserted.

// export default (id) => {
//   return `
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 350">
//   <defs>
//     <marker id="arrowhead" markerWidth="10" markerHeight="7"
//     refX="0" refY="3.5" orient="auto">
//       <polygon points="0 0, 10 3.5, 0 7" />
//     </marker>
//   </defs>
//   <line x1="50" y1="250" x2="50" y2="0" stroke="#000"
//   stroke-width="8" marker-start="url(#arrowhead)" />
// </svg>`;
// };

export default (id) => {
  return `
  <svg >
<defs>
  <marker id='head' orient="auto"
    markerWidth='3' markerHeight='4'
    refX='0.1' refY='2'>
    <path d='M0,0 V4 L3,2 Z' fill="black"/>
  </marker>
</defs>

<path
  id='arrow-line'
  marker-end='url(#head)'
  stroke-width='4'
  fill='none' stroke='black'  
  d='M 50,100, 50 20,120'
  />

</svg>`;
};

// export default (id) => {
//   return `
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 350">
//   <defs>
//     <marker id="arrowhead" markerWidth="10" markerHeight="7"
//     refX="0" refY="3.5" orient="auto">
//       <polygon points="0 0, 10 3.5, 0 7" />
//     </marker>
//   </defs>
//   <line x1="50" y1="250" x2="50" y2="0" stroke="#000"
//   stroke-width="8" marker-start="url(#arrowhead)" />
// </svg>`;
// };
