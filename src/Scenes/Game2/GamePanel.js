import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum, setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions"

let timerList = []
//3.5,-3.5,
// 5,-5

const stepRange = -0.04

let isGameStarted = false;
let currentNum = 0;
let stepNumRange = 5;
let currentStep = 0

let randomList = []
const subLeftList = [0.01, 0.015, 0.015, 0.02, 0.02, 0.02]
export default function Scene2({ finishGame, _baseGeo, stopSound }) {
    const audioList = useContext(UserContext)

    const baseRef = useRef()
    const backRef = useRef()

    const layoutStartPos = { x: -5, y: 3.5 }
    const translateStartPos = { x: 5, y: 3.5 }

    const characterList = Array.from({ length: 5 }, ref => useRef())
    const starList = Array.from({ length: 100 }, ref => useRef())
    const starBaseList = Array.from({ length: 100 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())

    const greenStarList = Array.from({ length: 6 }, ref => useRef())
    const redStarList = Array.from({ length: 6 }, ref => useRef())
    const lastBoy = useRef();
    const trasureObjList = [useRef(), useRef(), useRef()];


    const sparkBaseRef = useRef()
    const sparkRefList = [useRef(), useRef(), useRef()]

    // width : + -> -
    // height : - ->+

    const upStairList = [
        0, -0.45, -0.7, -1.02,
        -1.42, -1.78, -2.3,
        -2.7, -3.06, -3.38, -3.7
    ]

    const heightList = [
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        12, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 20, 22, 23,
        24, 25, 24, 25, 26,
        27, 28, 29, 30, 31,
        32, 33, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44,
        45, 46, 47, 48, 49,
        50, 51, 50, 52, 53,
        54, 55, 56, 58, 59,
        60, 62, 63, 65, 66,
        67, 68, 69, 70, 71,
        72, 73, 74, 75, 76,
        77, 78, 77, 79, 80,
        81, 82, 83, 84, 85,
        86, 87, 88, 89, 90,
        91, 92, 91, 92, 93,
    ]

    const widthStep = 0.647


    if (randomList.length == 0)
        while (randomList.length != 100) {
            let randomNumber = Math.floor(Math.random() * 6);
            randomList.push(randomNumber)
        }

    useEffect(
        () => {

            setRepeatAudio(audioList.subBodyAudio)
            isGameStarted = true;

            greenStarList.map(greenStar => { greenStar.current.style.opacity = 0 })
            redStarList.map(redStar => { redStar.current.style.opacity = 0 })



            characterList.map((character, index) => {
                if (index > 0)
                    character.current.setClass('hideObject')
            })


            backRef.current.style.transition = '0s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                + _baseGeo.height * (translateStartPos.y + upStairList[currentStep]) + 'px)'


            return () => {
                isGameStarted = false;
                randomList = []
                currentNum = 0;
                currentStep = 0

                audioList.clapAudio.pause();
            }
        }, []
    )

    if (isGameStarted)
        reRenderingFunc()

    function reRenderingFunc() {
        backRef.current.style.transition = '0s'

        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
            + _baseGeo.height * (translateStartPos.y + upStairList[currentStep]) + 'px)'

        characterList[0].current.setPosInfo({
            l: layoutStartPos.x + 0.08 + 0.065 * currentNum + (currentNum > 0 ? 0.02 : 0),
            b: layoutStartPos.y + 0.5 + stepRange * heightList[currentNum - 1]
        })
    }

    function clickFunc(num, typeNum) {

        stopRepeatAudio();

        if (currentNum == 0)
            stopSound(num + 1 == currentNum + stepNumRange)

        if (num >= currentNum) {
            let currentStar = starBaseList[num]
            currentStar.current.style.transition = '0.1s'
            currentStar.current.style.transform = 'scale(0.9)'
            setTimeout(() => {
                currentStar.current.style.transform = 'scale(1)'
            }, 100);

            redStarList.map(redStar => { redStar.current.style.opacity = 0 })
            greenStarList.map(greenStar => { greenStar.current.style.opacity = 0 });

            if (num + 1 == currentNum + stepNumRange) {

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();


                baseRef.current.style.pointerEvents = 'none'

                starBaseList[currentNum].current.style.cursor = 'default'
                starBaseList[currentNum + 1].current.style.cursor = 'default'

                currentNum += stepNumRange;
                showButtonAni(greenStarList[typeNum], num, false, typeNum)

                setTimeout(() => {

                    for (let i = 1; i < 5; i++) {
                        characterList[i].current.setPosInfo({
                            l: layoutStartPos.x + 0.16 + 0.065 * (currentNum - stepNumRange) + i * 0.05,
                            b: layoutStartPos.y + 0.5 + [0.05, 0.08, 0.1, 0.08, 0.05][i] + stepRange * heightList[currentNum - stepNumRange]
                        })
                    }

                    let num = 0;
                    let interval = setInterval(() => {
                        characterList[num].current.setClass('hideObject')

                        characterList[0].current.setPosInfo({
                            l: layoutStartPos.x + 0.1 + 0.065 * currentNum,
                            b: layoutStartPos.y + 0.5 + stepRange * heightList[currentNum - 1]
                        })

                        if (num == 4) {
                            clearInterval(interval)
                            characterList[0].current.setClass('showObject')

                        }
                        else {
                            num++
                            characterList[num].current.setClass('showObject')
                        }
                    }, 100);


                    sparkBaseRef.current.style.left = (layoutStartPos.x + 0.13 + 0.065 * currentNum) * 100 + "%"
                    sparkBaseRef.current.style.bottom = (layoutStartPos.y + 0.48 + stepRange * heightList[currentNum - 1]) * 100 + "%"

                    setTimeout(() => {
                        let num = 0;
                        sparkRefList[0].current.setClass('showObject')
                        let interval = setInterval(() => {
                            sparkRefList[num].current.setClass('hideObject')
                            if (num < 2) {
                                num++
                                sparkRefList[num].current.setClass('showObject')
                            }
                            else {
                                clearInterval(interval)
                            }
                        }, 100);
                    }, 500);

                    setTimeout(() => {

                        for (let i = currentNum - 5; i < currentNum; i++) {
                            if ((i + 1) % 5 != 0) {
                                starList[i].current.setUrl('SB54_Prop-Interactive/PI_Stone_inactivate_01.svg')
                                numberList[i].current.setStyle({ opacity: 0.4 })
                                starBaseList[i].current.style.cursor = 'default'
                            }
                            starBaseList[i].current.style.cursor = 'default'
                        }

                        if (currentNum % 10 == 0) {

                            currentStep++;
                            if (currentStep != 10) {
                                backRef.current.style.transition = '2s'
                                backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                                    + _baseGeo.height * (translateStartPos.y + upStairList[currentStep]) + 'px)'
                            }
                            else {
                                backRef.current.style.transition = '2s'
                                backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                                    + _baseGeo.height * (translateStartPos.y + upStairList[currentStep] + 0.1) + 'px)'
                            }


                            setTimeout(() => {
                                greenStarList.map(greenStar => { greenStar.current.style.opacity = 0 });
                                baseRef.current.style.pointerEvents = ''
                                if (currentStep == 10) {

                                    characterList[0].current.setClass('hideObject')
                                    lastBoy.current.setClass('showOjbect')


                                    let num = 0;
                                    let interval = setInterval(() => {
                                        if (num == 2)
                                            clearInterval(interval)
                                        else {
                                            trasureObjList[num].current.setClass('hideObject')
                                            num++
                                            trasureObjList[num].current.setClass('showObject')
                                        }
                                    }, 100);

                                    audioList.successAudio.play()
                                    
                                    setTimeout(() => {
                                        audioList.bodyAudio.play();
                                        audioList.clapAudio.play();
                                    }, 1000);

                                    setTimeout(() => {
                                        baseRef.current.style.transition = '0.7s'
                                        baseRef.current.style.opacity = 0

                                        setTimeout(() => {
                                            finishGame();
                                        }, 700);
                                    }, 5000);

                                }
                                else {
                                    startRepeatAudio();
                                }
                            }, 2000);
                        }

                        else {


                            baseRef.current.style.pointerEvents = ''
                            startRepeatAudio();
                        }


                    }, 1000);
                }, 200);
            }
            else {

                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();
                startRepeatAudio();
                showButtonAni(redStarList[typeNum], num, true, typeNum)
            }
        }
    }

    function showButtonAni(obj, num, isError = true, type = 0) {
        let left
        let bottom

        if (!isError) {
            left = (layoutStartPos.x + 0.179 + num * 0.065) * 100 + '%'
            bottom = (layoutStartPos.y + [0.42, 0.43, 0.43, 0.42, 0.425, 0.425][type] + heightList[num] * stepRange) * 100 + '%'
        }
        else {
            left = (layoutStartPos.x + 0.18 + num * 0.065) * 100 + '%'
            bottom = (layoutStartPos.y + [0.42, 0.423, 0.423, 0.423, 0.42, 0.423][type] + heightList[num] * stepRange) * 100 + '%'
        }

        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'
        obj.current.style.bottom = bottom
        obj.current.style.left = left

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1

        }, 100);
    }

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",

                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(11.5)'
                    }}
                    src={prePathUrl() + "images/SB54_BG/SB_54_Sky_bg-01.svg"}
                />

                <div
                    style={{
                        position: 'absolute',
                        width: '30%',
                        height: '50%',
                        cursor: 'pointer',
                        bottom: (layoutStartPos.y + 0.15) * 100 + '%',
                        left: (layoutStartPos.x - 0.12) * 100 + '%',
                        overflow: 'hidden'
                    }}>

                    <img draggable={false} width={"285%"}
                        src={prePathUrl() + 'images/SB54_Intro BG/SB_54_Intro_Game_2_PI_01.svg'}
                    />
                </div>

                {
                    Array.from(Array(100).keys()).map(value =>

                        <div
                            ref={starBaseList[value]}
                            onClick={() => { clickFunc(value, randomList[value]) }}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '11%',
                                cursor: 'pointer',
                                bottom: (layoutStartPos.y + 0.42 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.18 + value * 0.065) * 100 + '%'
                            }}>

                            < BaseImage
                                ref={starList[value]}
                                url={'SB54_Prop-Interactive/PI_Stone_0' + (randomList[value] + 1) + '.svg'}
                            />
                            < BaseImage
                                ref={numberList[value]}
                                scale={0.45}
                                posInfo={{ l: 0.25 + (value > 9 ? subLeftList[randomList[value]] : 0), t: 0.1 }}
                                url={'SB54_Text-Interactive/TI_G2_' + generateStandardNum(value + 1) + '.svg'}
                            />
                        </div>
                    )
                }

                < BaseImage
                    scale={0.125}
                    ref={lastBoy}
                    className='hideObject'
                    posInfo={{
                        l: layoutStartPos.x + 6.605,
                        b: layoutStartPos.y + 0.505 + 93 * stepRange
                    }}
                    url={'animations/SB54-37.svg'}
                />

                {
                    [0, 1, 2].map(value =>
                        < BaseImage
                            ref={trasureObjList[value]}
                            scale={0.3}
                            className={value > 0 ? 'hideObject' : ''}
                            posInfo={{
                                l: layoutStartPos.x + 6.905 + [0, 0, 0.015][value],
                                b: layoutStartPos.y + 0.2 + 93 * stepRange + [0, 0.005, 0.02][value],
                            }}
                            url={'animations/SB54_treasure_0' + (3 - value) + '.svg'}
                        />

                    )

                }




                {
                    Array.from(Array(6).keys()).map(value =>
                        <div
                            ref={redStarList[value]}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '11%',
                                pointerEvents: 'none',
                                bottom: (layoutStartPos.y + 0.423 + heightList[0] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.18) * 100 + '%'
                            }}>
                            < BaseImage
                                url={'SB54_Prop-Interactive/PI_Stone_Red_HL_0' + (value + 1) + '.svg'}
                            />
                        </div>
                    )
                }

                {
                    Array.from(Array(6).keys()).map(value =>
                        <div
                            ref={greenStarList[value]}
                            style={{
                                position: 'absolute',
                                width: '8.3%',
                                height: '11%',
                                pointerEvents: 'none',
                                bottom: (layoutStartPos.y + [0.42, 0.43, 0.43, 0.42, 0.425, 0.425][value] + heightList[0] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.179) * 100 + '%'
                            }}>
                            < BaseImage
                                url={'SB54_Prop-Interactive/PI_Stone_green_HL_0' + (value + 1) + '.svg'}
                            />
                        </div>
                    )
                }

                {Array.from(Array(5).keys()).map(value =>
                    <BaseImage
                        ref={characterList[value]}
                        scale={[0.08, 0.1, 0.12, 0.1, 0.12][value]}
                        posInfo={{
                            l: layoutStartPos.x + 0.08,
                            b: layoutStartPos.y + 0.54
                        }}
                        style={{ transform: 'scale(1.5) translate(10%, -10%)' }}
                        className='hideObject'
                        url={'animations/SB54_cape ' + [value + 1] + '.svg'}
                    />
                )}

                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'fixed',
                        pointerEvents: 'none',
                        width: '5%',
                        height: '5%',
                        left: (layoutStartPos.x + 0.132) * 100 + '%',
                        bottom: (layoutStartPos.y + 0.489) * 100 + '%'
                    }}
                >
                    {
                        Array.from(Array(3).keys()).map(value =>
                            <BaseImage
                                ref={sparkRefList[value]}
                                className='hideObject'
                                key={value + 308}
                                style={{ transform: 'scale(' + [1.5, 2, 3][value] + ')' }}
                                url={'Magic/sb_52_magic_wand_sparkels_' + (1 + value) + '.svg'}
                            />
                        )
                    }
                </div>

            </div>
        </div>
    );

}
