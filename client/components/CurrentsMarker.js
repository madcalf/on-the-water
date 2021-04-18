import React from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';

const CurrentsMarker = (props) => {
  const map = useMapEvents({
    click() {
      console.log('CLICK');
      handleClick();
    },
  });
  /*
   * receive data as props
   * display Leaflet Marker
   * display popup with
   *   Station Id
   *   Station Name
   *   Date Range of data in bold
   *   Tide or Current data as table
   * rotate icon based on currents specified time
   *   (either now or time set by user)
   *
   * So additional props might be:
   *   dateTime - date to use for arrow
   *
   * Actual current or tide data needs to be fetched onclick.
   *    Use current time if no 'global' time is specified.
   *
   *
   */
  // const icon = new Icon({
  //   iconUrl: Icon.Default.imagePath + 'current_arrow.svg',
  //   iconSize: [30, 50],
  //   iconAnchor: [25, 0],
  //   className: 'map-icon',
  // });
  Icon.Default.imagePath = 'leaflet-images/';
  const icon = L.divIcon({
    className: 'my-div-icon',
    // iconUrl: Icon.Default.imagePath + 'current_arrow.svg',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    // html: `<object type="image/svg+xml" data="../leaflet-images/current_arrow.svg">`,
    html: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.07992484839707 196.88498998224236" width="102.07992484839707" height="196.88498998224236">
    <!-- svg-source:excalidraw -->    
    <rect x="0" y="0" width="102.07992484839707" height="196.88498998224236" fill="none"></rect><g><g transform="translate(214.96394579629515 116.74650520817102) rotate(270 -163.9239833720966 -18.30401021704982)"><path d="M-75.4814883809754 -18.288279458892326 C-93.32316871719728 -31.638617008965618, -110.54373627603243 -47.56704968956497, -121.93124120638105 -58.52538534181205 M-77.22349748799888 -16.80988458917735 C-91.09085236900654 -31.32467980558942, -106.02159323013944 -43.93243358366574, -120.52614950716826 -59.34397264124838 M-119.42946038273062 -59.20130984280423 C-119.95651633121325 -53.55621971571825, -121.10387495646283 -48.65327858539715, -122.2083546116451 -43.93872373531118 M-121.12066887456368 -58.45456316246581 C-120.31466611434429 -53.5164376564444, -121.48496102331784 -49.57680297929422, -121.20231249066896 -43.05223657314279 M-120.80984268499408 -44.012603420129736 C-163.7373311555124 -44.432997238583894, -208.3596644739867 -42.420995633578585, -252.36647836321777 -41.75612672495167 M-122.47148875681553 -43.33013631339999 C-169.8614611049604 -42.540422663304625, -220.06802840145525 -42.91961445438318, -250.11369727382248 -43.7601605251662 M-249.5360244905371 -44.91723855661671 C-251.5286871117423 -22.35533412181007, -251.94222106284363 -4.613472308751227, -249.4514014253782 5.174620017328234 M-250.32874415645188 -42.28823192866962 C-250.29806563182945 -29.76011336939373, -251.22459551098333 -15.31287346467025, -249.51921190492976 5.894961584278317 M-248.7278201112913 5.168232306756945 C-224.21085324802522 5.412216578766081, -195.82740573322246 4.28555770255108, -121.55026783913641 7.195364883692175 M-250.28482641451228 6.916969526478024 C-208.659156346044 7.095017361863495, -168.9198538363355 7.231358473956739, -120.95921203241019 6.05021136492601 M-121.83563211910216 5.961377241441486 C-119.59188083963473 12.302533284471153, -119.11717799038924 17.22113488227618, -121.1575534078622 21.72030633626032 M-120.4593309148929 6.519214034165084 C-120.9126635141188 11.415185598798907, -119.93878872305496 15.832232502582805, -119.07244603515585 22.73595220714872 M-120.90303154949459 21.23966391121114 C-105.22348347249502 8.408701920074208, -90.30748682070329 -7.349628339062569, -78.21885958725898 -17.93377797306774 M-118.96881666321667 21.726439432400113 C-104.95452173023179 10.136189990366875, -90.65831296031692 -3.571105398014069, -76.21788904855339 -17.08490411565898" stroke="#000000" stroke-width="1" fill="none"></path></g></g></svg>`,
  });

  const handleClick = () => {
    let iconEl = document.querySelector('.my-div-icon');
    // iconEl.style.transform += ' rotate(20deg)';
    // const origTransform = iconEl.style.transform.split(' ')[0];
    // console.log('Orig transform', iconEl.style.transform);
    // iconEl.style.transform = origTransform + ' rotate(20deg)';
    // console.log('iconEl', iconEl);
    // DON'T SPLIT THE TRANSFORM. JUST SAVE IT TO STATE OR SOMETHING SO WE
    // CAN ADD TO IT. THE += THING JUST KEPT ADDING IT ON CUMMULATIVELY.
    //
  };
  // html: `<img src="${Icon.Default.imagePath}" + "current_arrow.svg" alt="" />`,

  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  // props: {position: [lat,lon], stationId: xx, stationName: xx, url:??}
  return (
    <Marker rotationAngle={30} position={station.position} icon={icon}>
      <Popup className="kp-popup">
        <h3 className="kp-popup-header">
          {station.stationId} {title}
        </h3>
        <p className="kp-popup-text">{subtitle}</p>
      </Popup>
    </Marker>
  );
};

export default CurrentsMarker;
/* 
 <Marker position={[37.833063, -122.471861]}>
  <Popup>
<h2>Station: SFB1203</h2>
<h2>Golden Gate Bridge</h2>
<table>
  <thead>
    <tr>
      <th>Date/Time (LST/LDT)</th>
      <th>Speed (knots)</th>
      <th>Dir (true)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2012-05-29 00:00:00</td>
      <td>1.20</td>
      <td>217</td>
    </tr>
    <tr>
      <td>2012-05-29 00:06:00</td>
      <td>1.42</td>
      <td>221</td>
    </tr>

  </tbody>
</table>
</Popup>
</Marker> */
