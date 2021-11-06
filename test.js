const left_block = document.getElementById("left_block");
const right_block = document.getElementById("right_block");
const info_block = document.getElementById("info_block");
const horizontal_slider_upper_part = document.getElementById("horizontal_slider_upper_part");
const horizontal_slider_lower_part = document.getElementById("horizontal_slider_lower_part");
const vertical_slider = document.getElementById("vertical_slider");
const both_slider = document.getElementById("both_slider");


const slide_event_onmousemove_horizontal = (e) => {
    left_block.style.width = e.clientX + "px";
}

const slide_event_onmousemove_vertical = (e) => {
    info_block.style.height = e.clientY + "px";
    horizontal_slider_upper_part.style.height = e.clientY + "px";
}

const slide_event_onmousemove_both = (e) => {
    slide_event_onmousemove_horizontal(e);
    slide_event_onmousemove_vertical(e);
}

const slide_event_onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;    
}

horizontal_slider_upper_part.onmousedown = () => {
    document.onmousemove = slide_event_onmousemove_horizontal;
    document.onmouseup = slide_event_onmouseup;
}
    
horizontal_slider_lower_part.onmousedown = () => {
    document.onmousemove = slide_event_onmousemove_horizontal;
    document.onmouseup = slide_event_onmouseup;
}

vertical_slider.onmousedown = () => {
    document.onmousemove = slide_event_onmousemove_vertical;
    document.onmouseup = slide_event_onmouseup;
}

both_slider.onmousedown = () => {
    document.onmousemove = slide_event_onmousemove_both;
    document.onmouseup = slide_event_onmouseup;
}


