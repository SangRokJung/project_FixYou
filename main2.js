(()=>{
    //스크롤 Y축의 값
    let yOffset = 0;

    // 현재 보여지는 section
    let currentSection = 0;     

    let PrevSectionHeight = 0;

    let sectionYOffset = 0;


    const sectionSet = [
        // section-0
        {
            // type : section의 구분값 (sticky : 글자위치가 고정되어 스크롤에 반응하는 섹션)
            //                          normal : 일반적인 스크롤 섹션
            type : 'sticky',

            // height : 스크롤의 높이, 초기화함수에서 화면 구성에 따라 비율로 설정됨.
            height : 0,

            // multiple : 스크롤 높이를 설정하기 위한 배수.
            multiple : 4,

            // section에서 사용하는 element들을 저장.
            objs : {
                container : document.querySelector('#section-0'),
                mainCanvas : document.querySelector('#main-canvas'),
                constext : document.querySelector('#main-canvas').getContext('2d'),
                canvasImages : [],

                seriseMsgA : document.querySelector('.serise-message.a'),
                seriseMsgB : document.querySelector('.serise-message.b'),
                seriseMsgC : document.querySelector('.serise-message.c'),
                seriseMsgD : document.querySelector('.serise-message.d'),
            },
            // section에서 사용하는 값들을 저장.
            values : {
                imageCount : 166,
                imageSequence : [0, 165],


                MessageA_opacity_in : [0, 1, {start : 0.1, end : 0.2}],
                MessageA_opacity_out : [1, 0, {start : 0.2, end : 0.3}],
                MessageA_translateY_in : [0, -50, {start : 0.1, end : 0.2}],
                MessageA_translateY_out : [-50, -100, {start : 0.2, end : 0.3}],

                MessageB_opacity_in : [0, 1, {start : 0.3, end : 0.4}],
                MessageB_opacity_out : [1, 0, {start : 0.4, end : 0.5}],
                MessageB_translateY_in : [0, -50, {start : 0.3, end : 0.4}],
                MessageB_translateY_out : [-50, -100, {start : 0.4, end : 0.5}],

                MessageC_opacity_in : [0, 1, {start : 0.5, end : 0.6}],
                MessageC_opacity_out : [1, 0, {start : 0.6, end : 0.7}],
                MessageC_translateY_in : [0, -50, {start : 0.5, end : 0.6}],
                MessageC_translateY_out : [-50, -100, {start : 0.6, end : 0.7}],

                MessageD_opacity_in : [0, 1, {start : 0.7, end : 0.8}],
                MessageD_opacity_out : [1, 0, {start : 0.8, end : 0.9}],
                MessageD_translateY_in : [0, -50, {start : 0.7, end : 0.8}],
                MessageD_translateY_out : [-50, -100, {start : 0.8, end : 0.9}],

                // 메세지 A의 불투명도를 0에서 1까지
                // 0.1(10%)지점 부터 0.2 지점까지 애니메이션 한다.
            }
        },
        
        // section-1
        {
            type : 'normal',
            height : 0,
            multiple : 4,
            objs : {
                container : document.querySelector('#section-1'),
                

            },
            values : {

            }
        },

        // section-2
        {
            type : 'sticky',
            height : 0,
            multiple : 4,            
            objs : {
                container : document.querySelector('#section-2'),

            },
            values : {


            }

        }        
    ];

//-------------------------------------------------------------------------
// 함수 파트
//-------------------------------------------------------------------------
    
    // sectionSet 배열을 초기화 해주는 함수.
    const initSectionSet = function()
    {
        // 높이를 설정.
        for(let i = 0; i < sectionSet.length; i++)
        {
            // 높이를 설정한다.
            sectionSet[i].height = window.innerHeight * sectionSet[i].multiple;                 
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;

        }
        //이미지를 불러온다.
        let eleImage = 0;
        for (let i = 0; i < sectionSet[0].values.imageCount; i++) {
            eleImage = new Image();
            
            eleImage.src = `./capture/DS_${i}.png`;
            canvasImages.push(eleImage);

            sectionSet[0].objs.canvasImages.push();
        }
    }    

    // yOffset에 따라 현재 보고있는 Section을 설정한다.
    // 스크롤이 일어날때 실행되어야 한다.
    const getCurrentSection = function()
    {   
        let result = 0;
        if (yOffset <= sectionSet[0].height)
        {
            result = 0;

        }
        else if ((yOffset > sectionSet[0].height) && 
                 (yOffset <= sectionSet[0].height + sectionSet[1].height))
        {
            result = 1;
            
        }
        else if (yOffset > sectionSet[0].height + sectionSet[1].height)
        {
            result = 2;
        }

        return result;
        
        // console.log('currentSection = ' + currentSection);
    }

    //현재 section의 위쪽 section의 합을 구하는 함수
    const getPrevSectionHeight = function () {
        let result = 0;

        for (let i = 0; i < currentSection; i++) {
            result = result + sectionSet[i].height;
        }

        return result;
    }

    // 최초에 HTML Page를 초기화하는 함수.
    const initHTMLPage = function()
    {
        // sectionSet을 초기화한다.
        initSectionSet();

        // 기타 전역변수들도 초기화.

    }

    // 스크롤시에 수행되는 함수
    const scrollLoop = function()
    {
        // currentSection을 설정한다.
        getCurrentSection();

        // currentSection에 따른 CSS값을 설정.
        document.body.setAttribute('id', `show-section-${currentSection}`)

        // 해당 currentSection에서 에니메이션을 실행한다.
        playAnimation();
    }

    const calcValue = function (values) {
        //현재 sectionY offset에 따라 values의 범위 내에서 값을 계산 
        let result = 0;
        let range = 0;
        let rate = 0;

        //구하고자 하는 영역의 높이 시작값, 끝 값, 영역의 전체 높이 값, 영역의 Y Offset
        let partStart = 0;
        let partEnd = 0;
        let partHeight = 0;

        if(values.length === 3){
            partStart = sectionSet[currentSection].height * values[2].start;
            partEnd = sectionSet[currentSection].height * values[2].end;
            console.log('sectionYOffset = ' + sectionYOffset)
            console.log('partStart = ' + partStart)
            console.log('partEnd = ' + partEnd)
            partHeight = partEnd - partStart;

            if (sectionYOffset >= partStart * 1.02 && sectionYOffset <= partEnd * 0.99) {
                console.log('Part ACTION VALUES')
                rate = (sectionYOffset - partStart) / partHeight;
                range = values[1] - values[0];
                result = ((rate * range) + values[0]);
                return result
            }
            else if (sectionYOffset < partStart * 1.02 ) {
                console.log('Part START VALUES')
                result = values[0]
                return result;
            }
            else if (sectionYOffset >= partEnd * 0.99) {
                console.log('Part END VALUES')
                result = values[1]
                return result;
            }
            //풀어서 쓴 식
            // rate = (sectionYOffset - (sectionSet[currentSection].height) * values[2].start ) / 
            //         ((sectionSet[currentSection].height) * (values[2].end - values[2].start))        
            // range = values[1] - values[0];
            // result = ((rate * range) + values[0]);
            // if (result <= 0.05) {
            //     result = 0;
            //     return result
            // }
            // else if (result >= 0.95) {
            //     result = 1;
            //     return result
            // }
            // return result
        } 
        else{
            //전체 높이 대비, sectionYOffset의 비율.
            rate = sectionYOffset / sectionSet[currentSection].height
            range = values[1] - values[0];
            result = (rate * range) + values[0]

            return result

            // Opacity Values만 허용 하는 식
            // if (values[1] > values[0]) {
            //     range = values[1] - values[0]
            //     result = (1 / range) * (sectionYOffset * (range / sectionSet[currentSection].height));

            //     return result
            // }
            // else {
            //     range = values[0] - values[1]
            //     result = (1 - ((1 / range) * (sectionYOffset * (range / sectionSet[currentSection].height))));

            //     return result
            // }
        }
    }

    const playAnimation = function() {
        let opInVal = 0;
        let opOutval = 0;
        let tsYinVal = 0;
        let tsYoutValue = 0;

        let imageIndex = 0;

        const cs = sectionSet[currentSection];

        const offsetRate = sectionYOffset / sectionSet[currentSection].height;
        console.log('offsetRate = ' + offsetRate)

        switch(currentSection){
            case 0 : 
                // 이미지 인덱스 0~165 출력
                imageIndex = Math.round(calcValue(cs.values.imageSequence));
                cs.objs.constext.drawImage(cs.objs.canvasImages[imageIndex], 0, 0)

                if (offsetRate < 0.1) {
                    opOutval = 0
                    cs.objs.seriseMsgA.style.opacity = `${opOutval}`;
                    cs.objs.seriseMsgB.style.opacity = `${opOutval}`;
                    cs.objs.seriseMsgC.style.opacity = `${opOutval}`;
                    cs.objs.seriseMsgD.style.opacity = `${opOutval}`;
                }
                else if (offsetRate >= 0.1 && offsetRate <= 0.2) {
                    opInVal = calcValue(cs.values.MessageA_opacity_in);
                    cs.objs.seriseMsgA.style.opacity = `${opInVal}`;

                    tsYinVal = calcValue(cs.values.MessageA_translateY_in);
                    cs.objs.seriseMsgA.style.transform = `translateY(${tsYinVal}px)`;
                }
                else if (offsetRate >= 0.2 && offsetRate <= 0.3) {
                    opOutval = calcValue(cs.values.MessageA_opacity_out)
                    cs.objs.seriseMsgA.style.opacity = `${opOutval}`;

                    tsYoutValue = calcValue(cs.values.MessageA_translateY_out);
                    cs.objs.seriseMsgA.style.transform = `translateY(${tsYoutValue}px)`;

                    cs.objs.seriseMsgB.style.opacity = `${0}`;
                }
                else if (offsetRate >= 0.3 && offsetRate <= 0.4) {
                    cs.objs.seriseMsgA.style.opacity = `${0}`;

                    opInVal = (cs.values.MessageB_opacity_in);
                    cs.objs.seriseMsgB.style.opacity = `${opInVal}`;

                    tsYinVal = calcValue(sectionSet[currentSection].values.MessageB_translateY_in);
                    sectionSet[currentSection].objs.seriseMsgB.style.transform = `translateY(${tsYinVal}px)`;
                }
                else if (offsetRate >= 0.4 && offsetRate <= 0.5) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageB_opacity_out);
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opOutval}`;

                    tsYoutValue = calcValue(sectionSet[currentSection].values.MessageB_translateY_out);
                    sectionSet[currentSection].objs.seriseMsgB.style.transform = `translateY(${tsYoutValue}px)`;

                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${0}`;
                }
                else if (offsetRate >= 0.5 && offsetRate <= 0.6) {
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${0}`;

                    opInVal = calcValue(sectionSet[currentSection].values.MessageC_opacity_in);
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opInVal}`;

                    tsYinVal = calcValue(sectionSet[currentSection].values.MessageC_translateY_in);
                    sectionSet[currentSection].objs.seriseMsgC.style.transform = `translateY(${tsYinVal}px)`;
                }
                else if (offsetRate >= 0.6 && offsetRate <= 0.7) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageC_opacity_out);
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opOutval}`;

                    tsYoutValue = calcValue(sectionSet[currentSection].values.MessageC_translateY_out);
                    sectionSet[currentSection].objs.seriseMsgC.style.transform = `translateY(${tsYoutValue}px)`;

                    sectionSet[currentSection].objs.seriseMsgD.style.opacity = `${0}`;
                }
                else if (offsetRate >= 0.7 && offsetRate <= 0.8) {
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${0}`;

                    opInVal = calcValue(sectionSet[currentSection].values.MessageD_opacity_in);
                    sectionSet[currentSection].objs.seriseMsgD.style.opacity = `${opInVal}`;

                    tsYinVal = calcValue(sectionSet[currentSection].values.MessageD_translateY_in);
                    sectionSet[currentSection].objs.seriseMsgD.style.transform = `translateY(${tsYinVal}px)`;
                }
                else if (offsetRate >= 0.8 && offsetRate <= 0.9) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageD_opacity_out);
                    sectionSet[currentSection].objs.seriseMsgD.style.opacity = `${opOutval}`;

                    tsYoutValue = calcValue(sectionSet[currentSection].values.MessageD_translateY_out);
                    sectionSet[currentSection].objs.seriseMsgD.style.transform = `translateY(${tsYoutValue}px)`;
                }
                else if (offsetRate >= 0.9 ) {
                    opOutval = 0
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opOutval}`;
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opOutval}`;
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opOutval}`;
                    sectionSet[currentSection].objs.seriseMsgD.style.opacity = `${opOutval}`;
                }
                //1. 스크롤 값을 기반으로 opacity 범위를 계산한다.
                // opVal = calcValue(sectionSet[currentSection].values.MessageA_opacity)
                
                //2. CSS에 적용한다.
                // sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opVal}`;
                break;

            case 1 : 
                break;

            case 2 : 
                const elemTag2 = document.getElementsByClassName('staff-info');
                opVal = (sectionYOffset) * (1/sectionSet[2].height);
                
                for (let i = 0; i < elemTag2.length; i ++) {
                    elemTag2[i].style.opacity = `${opVal}`
                }
            
                break;
        }
    }


    //최초 이벤트 함수
    const ttTag = document.querySelector('#section-0-title')

    //인터벌
    let intv;
    //opacity, translate Value
    let opctValue = 0;
    let tslYValue = 0;
    //bRunFlag
    let bRunFlag = null;

    const animi = function() {
        console.log('start')
        opctValue += 0.05;
        tslYValue -= 1;
        if(opctValue >= 1){
            clearInterval(intv)
            return
        }

        ttTag.style.opacity = `${opctValue}`
        ttTag.style.transform = `translateY(${tslYValue}px)`
    }

//-------------------------------------------------------------------------
// 이벤트 핸들러
//-------------------------------------------------------------------------

    window.addEventListener('scroll', ()=>{      
        // 스크롤 값
        // 현재 센셕
        // 이전 섹션의 높이
        // 현재 섹션내에서 스크롤 값          
        yOffset             = window.scrollY;
        currentSection      = getCurrentSection();
        PrevSectionHeight   = getPrevSectionHeight();
        sectionYOffset      = yOffset - PrevSectionHeight;

        console.log()
        scrollLoop();

    });

    window.addEventListener('DOMContentLoaded', () => {
        //인터벌 함수 호출
        intv = setInterval(animi, 10)
    })
    

//-------------------------------------------------------------------------
// 함수 호출
//-------------------------------------------------------------------------
    initHTMLPage();


})();