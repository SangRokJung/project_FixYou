(()=>{
    // 스크롤 값
    let yOffset = 0;

    // 현재 보여지는 section
    let currentSection = 0;     

    let PrevSectionHeight = 0;

    let sectionYOffset = 0;

    let intv;

    let bRunFlag = null;

    let opctValue = 0;
    let tslYValue = 0;


    const sectionSet = [
        // section-0
        {
            // type : section의 구분값 (sticky : 글자위치가 고정되어 스크롤에 반응하는 섹션)
            //                          normal : 일반적인 스크롤 섹션
            type : 'normal',

            // height : 스크롤의 높이, 초기화함수에서 화면 구성에 따라 비율로 설정됨.
            height : 0,

            // multiple : 스크롤 높이를 설정하기 위한 배수.
            multiple : 1,

            // section에서 사용하는 element들을 저장.
            objs : {
                container : document.querySelector('#section-0'),
                seriseMsgA : document.querySelector('.fadein-items0'),
                seriseVdieoA : document.querySelector('#div_id_main_vidieo')
            },
            // section에서 사용하는 값들을 저장.
            values : {
                MessageA_opacity : [0, 1],
                // VideioA_opacity : [0, 1]
            }

        },
        
        // section-1
        {
            type : 'sticky',
            height : 0,
            multiple : 6,
            objs : {
                container : document.querySelector('#section-1'),
                seriseMsgA : document.querySelector('.fadein-items1'),
                seriseMsgB : document.querySelector('.fadein-items2'),
                seriseMsgC : document.querySelector('.fadein-items3'),

            },
            values : {
                MessageA_opacity_in : [0, 1, {start : 0.1, end : 0.25}],
                MessageA_opacity_out : [1, 0, {start : 0.25, end : 0.4}],

                MessageB_opacity_in : [0, 1, {start : 0.4, end : 0.55}],
                MessageB_opacity_out : [1, 0, {start : 0.55, end : 0.7}],

                MessageC_opacity_in : [0, 1, {start : 0.7, end : 0.85}],
                MessageC_opacity_out : [1, 0, {start : 0.85, end : 1.0}],
            }

        },

        // section-2
        {
            type : 'sticky',
            height : 0,
            multiple : 3,            
            objs : {
                container : document.querySelector('#section-2'),

            },
            values : {
                MessageA_opacity : [0, 1],
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

    }    

    // yOffset에 따라 현재 보고있는 Section을 설정한다.\
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
        yOffset = 0;

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
                // console.log('Part ACTION VALUES')
                rate = (sectionYOffset - partStart) / partHeight;
                range = values[1] - values[0];
                result = ((rate * range) + values[0]);
                return result
            }
            else if (sectionYOffset < partStart * 1.02 ) {
                // console.log('Part START VALUES')
                result = values[0]
                return result;
            }
            else if (sectionYOffset >= partEnd * 0.99) {
                console.log('Part END VALUES')
                result = values[1]
                return result;
            }
            // 풀어쓴 식
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

        const offsetRate = sectionYOffset / sectionSet[currentSection].height;
        console.log('offsetRate = ' + offsetRate)

        switch(currentSection){
            case 0 : 
                sectionSet[1].objs.seriseMsgA.style.display = `${'none'}`;
                sectionSet[1].objs.seriseMsgB.style.display = `${'none'}`;
                sectionSet[1].objs.seriseMsgC.style.display = `${'none'}`;
                break;

            case 1 : 
                if (offsetRate < 0.1) {
                    opOutval = 0;
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opOutval}`;
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opOutval}`;
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opOutval}`;
                }
                else if (offsetRate >= 0.1 && offsetRate <= 0.25) {
                    sectionSet[currentSection].objs.seriseMsgA.style.display = `${'block'}`;

                    opInVal = calcValue(sectionSet[currentSection].values.MessageA_opacity_in)
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opInVal}`;
                }
                else if (offsetRate >= 0.25 && offsetRate <= 0.4) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageA_opacity_out)
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opOutval}`;
                }
                else if (offsetRate >= 0.4 && offsetRate <= 0.55) {
                    sectionSet[currentSection].objs.seriseMsgA.style.display = `${'none'}`;
                    sectionSet[currentSection].objs.seriseMsgB.style.display = `${'block'}`;

                    opInVal = calcValue(sectionSet[currentSection].values.MessageB_opacity_in)
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opInVal}`;
                }
                else if (offsetRate >= 0.55 && offsetRate <= 0.7) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageB_opacity_out)
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opOutval}`;
                }
                else if (offsetRate >= 0.7 && offsetRate <= 0.85) {
                    sectionSet[currentSection].objs.seriseMsgB.style.display = `${'none'}`;
                    sectionSet[currentSection].objs.seriseMsgC.style.display = `${'block'}`;

                    opInVal = calcValue(sectionSet[currentSection].values.MessageC_opacity_in)
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opInVal}`;
                }
                else if (offsetRate >= 0.85 && offsetRate <= 1) {
                    opOutval = calcValue(sectionSet[currentSection].values.MessageC_opacity_out)
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opOutval}`;
                }
                else{
                }
            //1. 스크롤 값을 기반으로 opacity 범위를 계산한다.
            // opVal = calcValue(sectionSet[currentSection].values.MessageA_opacity)
            
            //2. CSS에 적용한다.
            // sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opVal}`;
            break;

            case 2 : 
            sectionSet[2].objs.seriseMsgC.style.display = `${'none'}`;

                sectionSet[1].objs.seriseMsgC.style.opacity = `${0}`;

                opVal = calcValue(sectionSet[currentSection].values.MessageA_opacity)
                sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opVal}`;
            
                break;
        }
    }


    //---------------------------------------------------------------------
    //최초 로딩시 발생하는 이벤트
    //인터벌
    //opacity, translate Value
    //bRunFlag

    const animi = function() {
        console.log('WINDOW Loading EVENT START')

        if (opctValue < 0.93){
            opctValue += 0.01;
            tslYValue -= 0.5;
            sectionSet[0].objs.seriseMsgA.style.opacity = `${opctValue}`;
            sectionSet[0].objs.seriseMsgA.style.transform = `translateY(${tslYValue}px)`
            sectionSet[0].objs.seriseVdieoA.style.opacity = `${opctValue}`;
            // sectionSet[0].objs.seriseVdieoA.style.transform = `translateY(${tslYValue}px)`
        }
        else if (opctValue >= 0.93){
            console.log('WINDOW Loading EVENT END')
            opctValue = 1;
            clearInterval(intv);
            sectionSet[0].objs.seriseMsgA.style.opacity = `${opctValue}`;
            sectionSet[0].objs.seriseMsgA.style.transform = `translateY(${tslYValue}px)`
            sectionSet[0].objs.seriseVdieoA.style.opacity = `${opctValue}`;
            // sectionSet[0].objs.seriseVdieoA.style.transform = `translateY(${tslYValue}px)`

            return
        }
        // console.log('opctValue = ' + opctValue)
        // console.log('tslYValue = ' + tslYValue)
    }
    // END
    //---------------------------------------------------------------------

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

    scrollLoop();
});



window.addEventListener('load', () => {
    intv = setInterval(animi, 10)
})
    

//-------------------------------------------------------------------------
// 함수 호출
//-------------------------------------------------------------------------
    initHTMLPage();


})();