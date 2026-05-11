import Rain from 'react-rain-animation';
import 'react-rain-animation/lib/style.css';

function RainyBackground() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}>
      <Rain numDrops="200" />
    </div>
  );
}

export default RainyBackground;
