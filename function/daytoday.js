require('dotenv').config()
const OpenAI =require('openai').OpenAI;
const openai = new OpenAI();

async function daytoday(roadmap,generalTips) {
  console.log("in func")
    console.log(roadmap)
    const skills = roadmap.skills;
    const completion = await openai.chat.completions.create({
      messages: [
        { 
            role: "system", 
            content: "You are a placement consultant." 
        },
        {
            role: 'user',
        content: `
                    make a ${roadmap.duration} day to day plan to achieve my target ${roadmap.target} and skills : ${roadmap.skills} with my focus on ${roadmap.description} and ${generalTips}  
                    Generate a day to day plan for all the target and skills mentioned within the duration.
                    In the plan include each day target, focus ,description, platform and questions.
                    Generate a valid JSON response in a similar format
    {
        plan: []
    }
                    Note:
        - Make sure to include each day.
        - Make sure type of day is number.       
        - Target should be about what student is achieving in that day.
        - Provide a single-line JSON response. 
        - Respond only with the generated JSON response.
        - Do not add new lines;
        -use lower case only
        -if user has to solve questions provide name of plaftform like leetcode and hackerrank
        `,
      
        }
    ],
      model: "gpt-3.5-turbo-1106",
    });
  
    console.log( typeof(completion.choices[0].message.content));
    if(typeof(completion.choices[0].message.content) == 'string')
    var content = JSON.parse(completion.choices[0].message.content)
    return content;
  }
  

module.exports = daytoday;