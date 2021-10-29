import Arrow from '@elsdoerfer/react-arrow';

const CurrentArrow = ({ angle, length }) => (
  <Arrow
    angle={angle}
    length={length}
    style={{
      width: '100px',
    }}
  />
);

export default Arrow;
