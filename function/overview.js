require('dotenv').config()
const OpenAI =require('openai').OpenAI;
const openai = new OpenAI();

async function overview(student,company,time, role) {
    // console.log(process.env.OPENAI_API_KEY)
    const completion = await openai.chat.completions.create({
      messages: [
        { 
            role: "system", 
            content: "You are a placement consultant." 
        },
        {
            role: 'user',
        content: `
        consider following details of student along with the desiredCompany, desiredRole and timePeriod:
                    student:${student}
                    desiredCompany:${company}
                    desiredRole:${role}
                    timePeriod:${time}
                    Generate a roadmap for the student to get placed at the desired company with desired role. 
                    The roadmap should include skills and technologies that student needs to 
                    practice with targets, description and make sure that roadmap is for time period as shared.
                    Generate a valid JSON response in a similar format
    {
        roadmap: [{}],
        generalTips: [],
        totalTime:''
    }
                    Note:
        - Include skills, target, desctiption and duration.
        - Make sure Skill is an array.
        - Target should what student is achieving in that duration.
        - Make sure the sum of all duration is < timePeriod or sum of all duration is = timePeriod. 
        - the duration should be in a string.
        - Provide a single-line JSON response. 
        - Respond only with the generated JSON response.
        - Do not add new lines;
        -use lower case only
        `,
      
        }
    ],
      model: "gpt-3.5-turbo-1106",
    });
  
    // console.log(completion.choices[0].message.content);
    if(typeof(completion.choices[0].message.content) == 'string')
    var content = JSON.parse(completion.choices[0].message.content)
    return content;
  }
  
//main(input);

module.exports = overview;