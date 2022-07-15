const fileInput = document.querySelector('.file-input'),
chooseImgBtn = document.querySelector('.choose-img'),
previewImg = document.querySelector('.preview-img img'),
filterOptions = document.querySelectorAll('.filter button'),
filterName = document.querySelector('.filter-info .name'),
filterSlider = document.querySelector('.slider input'),
filterValue = document.querySelector('.filter-info .value')
rotateOptions = document.querySelectorAll('.rotate button'),
resetFilterBtn = document.querySelector('.reset-filter'),
saveImgBtn= document.querySelector('.save-img');


let brightness = 100,
saturation = 100,
inversion = 0,
grayscale = 0;

let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
};

const loadImage = ()=>{
    let file = fileInput.files[0]; // getting user selected file
    if(!file) return; // return noting if the user didn't select an image
    // console.log(file);
    previewImg.src = URL.createObjectURL(file); // passing file url as preview img src
    previewImg.addEventListener('load', ()=>{
        resetFilterBtn.click();
        document.querySelector('.container').classList.remove('disable');
    })
}

filterOptions.forEach(option => {
    option.addEventListener('click', ()=>{
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerText = option.innerText;

        if(option.id === 'brightness'){
            filterSlider.max = '200';
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === 'saturation'){
            filterSlider.max = '200';
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id === 'inversion'){
            filterSlider.max = '100';
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = '100';
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});




const updateFilter = ()=>{
    // console.log(filterSlider.value);
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');
    
    if (selectedFilter.id === 'brightness'){
        brightness = filterSlider.value;
    } else if (selectedFilter.id === 'saturation'){
        saturation = filterSlider.value;
    } else if (selectedFilter.id === 'inversion'){
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
};

rotateOptions.forEach(option=>{
    option.addEventListener('click', ()=>{ //adding click event listener to all rotate/flip buttons
        // console.log(option)
        if (option.id === 'left'){
            rotate -= 90;
        } else if (option.id === 'right'){
            rotate += 90;
        } else if (option.id === 'horizontal'){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

const resetFilter = ()=>{
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    flipVertical = 1;
    flipHorizontal=1;

    filterOptions[0].click(); // clicking brightness btn as default

    applyFilters();
};

const saveImg = () =>{
    // console.log('save image btn clicked')
    const canvas = document.createElement('canvas'); //creating a canvas element
    const ctx = canvas.getContext('2d');
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2, canvas.height/2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

    // document.body.appendChild(canvas);
    const link = document.createElement('a'); //creating <a> 
    link.download = 'image.jpg'; // passing <a> to download value "image.jpg"
    link.href = canvas.toDataURL(); //passing <a> href value to canvas data url
    link.click(); // clicking <a> to download image
};

resetFilterBtn.addEventListener('click', resetFilter);
fileInput.addEventListener('change',loadImage);
filterSlider.addEventListener('input',updateFilter);
saveImgBtn.addEventListener('click',saveImg);
chooseImgBtn.addEventListener('click', ()=>fileInput.click());