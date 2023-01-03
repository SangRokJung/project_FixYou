(()=>{
    // 스크롤 값
    let yOffset = 0;

    // 현재 보여지는 section
    let currentSection = 0;     

    let prevSectionHeight = 0;


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
                seriseMsgA : document.querySelector('#section-0 .serise-message.a'),
                seriseMsgB : document.querySelector('#section-0 .serise-message.b'),
                seriseMsgC : document.querySelector('#section-0 .serise-message.c'),
                mainCanvas : document.querySelector('#main-canvas'),
                context : document.querySelector('#main-canvas').getContext('2d'),
                canvasImages : []
            },
            // section에서 사용하는 값들을 저장.
            values : {
                imageCount : 166,
                imageSequence : [0, 165],
                messageA_opacity_out    : [0, 1, {start: 0.1, end: 0.2}],
                messageA_opacity_in     : [1, 0, {start: 0.2, end: 0.3}],
                
                messageB_opacity_out    : [0, 1, {start: 0.4, end: 0.5}],
                messageB_opacity_in     : [1, 0, {start: 0.5, end: 0.6}],
                                
                messageC_opacity_out    : [0, 1, {start: 0.7, end: 0.8}],
                messageC_opacity_in     : [1, 0, {start: 0.8, end: 0.9}],
                
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

        // 이미지를 불러온다.
        let elmImage = null;
        for (let i = 0; i < sectionSet[0].values.imageCount; i++)
        {
            elmImage = new Image();
            elmImage.src = `../../capture/DS_${i}.png`;
            
            sectionSet[0].objs.canvasImages.push(elmImage);
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
        
    }

    // 현재 section의 위쪽 section의 높이 합을 구한다.
    const getPrevSectionHeight = function()
    {
        let result = 0;

        for (let i = 0; i < currentSection; i++)
        {
            result = result + sectionSet[i].height;

        }

        return result;
    }

    // 최초에 HTML Page를 초기화하는 함수.
    const initHTMLPage = function()
    {
        // sectionSet을 초기화한다.
        initSectionSet();


    }

    // sectionYOffset의 위치를 판단해서.
    // 파라미터로 들어온 values의 범위 내에 적당한 값을 리턴한다.    
    const calcValue = function(values)
    {
        
        let result = 0;
        let rate = 0;
        
        let partStart = 0;      // start의 offset값
        let partEnd = 0;        // end의 offset값.
        let partHeight = 0;

        const range = values[1] - values[0];
        const sectionHeight = sectionSet[currentSection].height;



        if (values.length === 3)
        {
            partStart = sectionHeight * values[2].start;
            partEnd = sectionHeight * values[2].end;
            partHeight = partEnd - partStart;


            if ((sectionYOffset >= partStart) && (sectionYOffset <= partEnd))
            {
                //1. 비율
                rate = (sectionYOffset - partStart) / partHeight;
                result = (rate * range) + values[0];               

            }
            else if (sectionYOffset < partStart)
            {
                result = values[0];

            }
            else if (sectionYOffset > partEnd)
            {
                result = values[1];

            }
            
        }
        else
        {
            rate = sectionYOffset / sectionHeight;
            result = (range * rate) + values[0];
      
        }

        return result;

    }


    const playAnimation = function()
    {
        let opacityValue = 0;
        let translateValue = 0;
        let imageIndex = 0;
        const cs = sectionSet[currentSection];
        

        const offsetRate = sectionYOffset / cs.height;

        switch(currentSection)
        {
            case 0 :
                // 이미지 인덱스 0~165까지 나오는게 목표.
                //[0, 165]
                imageIndex = Math.round(calcValue(cs.values.imageSequence));
                cs.objs.context.drawImage(cs.objs.canvasImages[imageIndex], 0, 0);
                

                if (offsetRate < 0.1)
                {
                    cs.objs.seriseMsgA.style.opacity = `0`;
                    cs.objs.seriseMsgB.style.opacity = `0`;
                    cs.objs.seriseMsgC.style.opacity = `0`;
                }
                else if ((offsetRate >= 0.1) && (offsetRate <= 0.2))
                {
                    opacityValue = calcValue(cs.values.messageA_opacity_out);
                    cs.objs.seriseMsgA.style.opacity = `${opacityValue}`;

                }
                else if ((offsetRate > 0.2) && (offsetRate <= 0.3))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageA_opacity_in);
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `${opacityValue}`;
                }
                else  if ((offsetRate > 0.3) && (offsetRate < 0.4))
                {
                    cs.objs.seriseMsgA.style.opacity = `0`;
                    cs.objs.seriseMsgB.style.opacity = `0`;
                    cs.objs.seriseMsgC.style.opacity = `0`;
                }
                else if ((offsetRate >= 0.4) && (offsetRate <= 0.5))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageB_opacity_out);
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opacityValue}`;

                }
                else if ((offsetRate > 0.5) && (offsetRate <= 0.6))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageB_opacity_in);
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `${opacityValue}`;
                }
                else if ((offsetRate > 0.6) && (offsetRate < 0.7))
                {
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `0`;
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `0`;
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `0`;
                }
                else if ((offsetRate >= 0.7) && (offsetRate <= 0.8))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageC_opacity_out);
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opacityValue}`;
                }
                else if ((offsetRate > 0.8) && (offsetRate <= 0.9))
                {
                    opacityValue = calcValue(sectionSet[currentSection].values.messageC_opacity_in);
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `${opacityValue}`;
                    if (opacityValue < 0.3)
                    {
                        sectionSet[currentSection].objs.mainCanvas.style.opacity = '0';    
                    }
                    else
                    {
                        sectionSet[currentSection].objs.mainCanvas.style.opacity = `${opacityValue}`;
                    }
                    


                }
                else
                {
                    sectionSet[currentSection].objs.seriseMsgA.style.opacity = `0`;
                    sectionSet[currentSection].objs.seriseMsgB.style.opacity = `0`;
                    sectionSet[currentSection].objs.seriseMsgC.style.opacity = `0`;

                }
                break;

            case 1 :
                
                break;
    
            case 2 :
                
                break;
    
        }
    
    }


    // 스크롤시에 수행되는 함수
    const scrollLoop = function()
    {   
        // currentSection에 따른 CSS값을 설정.
        document.body.setAttribute('id', `show-section-${currentSection}`);

        // 해당 currentSection에서 실행할 애니메이션을 돌린다.
        playAnimation();
        
    }

    

//-------------------------------------------------------------------------
// 이벤트 핸들러
//-------------------------------------------------------------------------

    window.addEventListener('scroll', ()=>{

        // 스크롤값(yOffset), 
        // 현재 섹션 (currentSection)
        // 이전섹션의높이(prevSectionHeight)
        // 현재 섹션내에서의 스크롤값(sectionYOffset)
        yOffset             = window.scrollY;
        currentSection      = getCurrentSection();                    
        prevSectionHeight   = getPrevSectionHeight();
        sectionYOffset      = yOffset - prevSectionHeight;
 

        scrollLoop();

    });
    

//-------------------------------------------------------------------------
// 함수 호출
//-------------------------------------------------------------------------
    initHTMLPage();


})();