import React, { useEffect } from 'react';

const VolumeMeterIcon = ({ volume = 0 }) => {
    // We need to focus out the navigation tab
    // I added the logic here, in order the logic
    // to be isolatedfrom the jitsi-meet
    useEffect(() => {
        const el = document.querySelector('.iqNwPx');

        el.blur();
    }, []);

    const innerVolume = volume * 100;
    const color = {
        default: '#F5F6FA',
        active: '#9141B8'
    };
    const getColor = index => {
        let res = color.default;

        if (innerVolume > index) {
            res = color.active;
        }

        return res;
    };

    return (
        <svg width="100%" height="6" viewBox="0 0 230 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2.5" cy="2.5" r="2.5" fill={getColor(0)}/>
            <circle cx="11.5" cy="2.5" r="2.5" fill={getColor(1)}/>
            <circle cx="20.5" cy="2.5" r="2.5" fill={getColor(2)}/>
            <circle cx="29.5" cy="2.5" r="2.5" fill={getColor(3)}/>
            <circle cx="38.5" cy="2.5" r="2.5" fill={getColor(4)}/>
            <circle cx="47.5" cy="2.5" r="2.5" fill={getColor(5)}/>
            <circle cx="56.5" cy="2.5" r="2.5" fill={getColor(6)}/>
            <circle cx="65.5" cy="2.5" r="2.5" fill={getColor(7)}/>
            <circle cx="74.5" cy="2.5" r="2.5" fill={getColor(8)}/>
            <circle cx="83.5" cy="2.5" r="2.5" fill={getColor(9)}/>
            <circle cx="92.5" cy="2.5" r="2.5" fill={getColor(10)}/>
            <circle cx="101.5" cy="2.5" r="2.5" fill={getColor(11)}/>
            <circle cx="110.5" cy="2.5" r="2.5" fill={getColor(12)}/>
            <circle cx="119.5" cy="2.5" r="2.5" fill={getColor(13)}/>
            <circle cx="128.5" cy="2.5" r="2.5" fill={getColor(14)}/>
            <circle cx="137.5" cy="2.5" r="2.5" fill={getColor(15)}/>
            <circle cx="146.5" cy="2.5" r="2.5" fill={getColor(16)}/>
            <circle cx="155.5" cy="2.5" r="2.5" fill={getColor(17)}/>
            <circle cx="164.5" cy="2.5" r="2.5" fill={getColor(18)}/>
            <circle cx="173.5" cy="2.5" r="2.5" fill={getColor(19)}/>
            <circle cx="182.5" cy="2.5" r="2.5" fill={getColor(20)}/>
            <circle cx="191.5" cy="2.5" r="2.5" fill={getColor(21)}/>
            <circle cx="200.5" cy="2.5" r="2.5" fill={getColor(22)}/>
            <circle cx="209.5" cy="2.5" r="2.5" fill={getColor(23)}/>
            <circle cx="218.5" cy="2.5" r="2.5" fill={getColor(24)}/>
            <circle cx="227.5" cy="2.5" r="2.5" fill={getColor(25)}/>
        </svg>
    );
};

export default VolumeMeterIcon;
