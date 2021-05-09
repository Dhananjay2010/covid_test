const puppy = require("puppeteer");
const fs=require("fs");

let data=[];

let states_names=["Andhra Pradesh","Arunachal Pradesh","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
"Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra",
"Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Tamil Nadu","Tripura","Uttar Pradesh","Uttarakhand",
"West Bengal"];

async function various_States(){

    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false
    });

    let tabs = await browser.pages();
    let tab = tabs[0];

    for(let i=0;i<states_names.length;i++){

        data.push({
            "State Name":"",
            "Confirmed cases": "",
            "Active cases":"" ,
            "Recovered cases":"" ,
            "Deceased cases":"" ,
            "People Tested":"",
            "Population":"",
            "Vaccine doses given":"",
            "Facts" : [],
            "Top Districts":[]
        });
        await main(states_names[i], i, tab);
    }

    fs.writeFileSync("Stated_Data.json", JSON.stringify(data));

    await browser.close();
}


async function main(state_name, k, tab) {

    await tab.goto("https://www.covid19india.org/");

    await tab.waitForSelector('input[type="text"]',{visible:true});
    await tab.click('input[type="text"]');

    await tab.type('input[type="text"]', state_name);

    await tab.waitForSelector(".result", {visible:true});
    await tab.click(".result");

    data[k]["State Name"]= state_name;

    await tab.waitForSelector('.Level .level-item.is-confirmed.fadeInUp h1');
    let confirmed_class=await tab.$('.Level .level-item.is-confirmed.fadeInUp h1');
    let confirmed_cases=await tab.evaluate(function (ele){
        return ele.innerText;
    }, confirmed_class);

    data[k]["Confirmed cases"]=confirmed_cases;


    await tab.waitForSelector('.Level .level-item.is-active.fadeInUp h1');
    let Active_class=await tab.$('.Level .level-item.is-active.fadeInUp h1');
    let Active_cases=await tab.evaluate(function (ele){
        return ele.innerText;
    }, Active_class);
    data[k]["Active cases"]=Active_cases;
    

    await tab.waitForSelector('.Level .level-item.is-recovered.fadeInUp h1');
    let Recovered_class=await tab.$('.Level .level-item.is-recovered.fadeInUp h1');
    let Recovered_cases=await tab.evaluate(function (ele){
        return ele.innerText;
    }, Recovered_class);
    data[k]["Recovered cases"]=Recovered_cases;
    


    await tab.waitForSelector('.Level .level-item.is-deceased.fadeInUp h1');
    let Deceased_class=await tab.$('.Level .level-item.is-deceased.fadeInUp h1');  
    let Deceased_cases=await tab.evaluate(function (ele){
        return ele.innerText;
    }, Deceased_class);
    data[k]["Deceased cases"]=Deceased_cases;


    await tab.waitForSelector('.header-right.fadeInUp h2')
    let people_class=await tab.$('.header-right.fadeInUp h2');
    let people_tested=await tab.evaluate(function (ele){
        return ele.innerText;
    }, people_class);
    data[k]["People Tested"]=people_tested;


    await tab.evaluate( () => {
        window.scrollBy(0, window.innerHeight);
    });

    
    await tab.waitForSelector(".StateMeta p", {visible:true});
    let stats_data=await tab.$$(".StateMeta p");

    for(let i=0;i<6;i++){
        let a=await tab.evaluate(function(ele){
            return ele.innerText;
        },stats_data[i]);

        data[k]["Facts"].push(a);

    }

    await tab.waitForSelector(".LevelVaccinated.fadeInUp h4");
    let Vaccine_doses=await tab.$(".LevelVaccinated.fadeInUp h4");
    let Vaccine=await tab.evaluate(function(ele){
        return ele.innerText;
    },Vaccine_doses);

    data[k]["Vaccine doses given"]=Vaccine;


    await tab.waitForSelector(".districts.fadeInUp .district h5", {visible:true});
    let district_name=await tab.$$(".districts.fadeInUp .district h5");

    await tab.waitForSelector(".districts.fadeInUp .district h2", {visible:true});
    let district_data=await tab.$$(".districts.fadeInUp .district h2");

    for(let j=0;j<district_name.length;j++){
        let name=await tab.evaluate(function(ele){
            return ele.innerText;
        },district_name[j]);

        let active_value=await tab.evaluate(function(ele){
            return ele.innerText;
        },district_data[j]);

        data[k]["Top Districts"].push({
            "District name": name,
            "Active cases": active_value
        });
    }

    await tab.waitForSelector(".meta-item.population h1");
    let population_data=await tab.$(".meta-item.population h1");
    let population=await tab.evaluate(function(ele){
        return ele.innerText;
    },population_data);

    data[k]["Population"]=population;


}

various_States();


