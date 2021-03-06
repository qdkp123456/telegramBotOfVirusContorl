const request = require("request");

const cookie = "youCookie=whrs=whrs&eventid=1";
const url = "https://familyweb.wistron.com/whrs/temperature_addnew_act.aspx";
const j = request.jar();

const moment = require("moment-timezone");

headers = {
  Cookie: "",
  Origin: "https://familyweb.wistron.com",
  Referer: "https://familyweb.wistron.com/whrs/temperature.aspx",
  "Upgrade-Insecure-Requests": 1
};

form = {
  survey: 0,
  empid: null,
  eventid: 1,
  trip: 1,
  travel: 1,
  notice: 1,
  family: 1,
  tour: 1,
  measure_date: null, //like '2020/3/11'
  symptom: 1
};

// for fiddler fetch info
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

exports.autofill = (userid, usernm) =>
  new Promise((res, rej) => {
    try {
      setData(userid, usernm).then(dateToFill => {
        request.post(
          {
            url: url,
            jar: j,
            form: form,
            headers: headers
            // proxy: "http://127.0.0.1:8888" // for fiddler
          },
          function (err, resp, body) {
            // resp_msg = body
            // console.log(body)
            resp_msg = body.split`('`[1].split`')`[0];
            res({
              response:
                "[" +
                dateToFill +
                "] (" +
                userid +
                ":" +
                usernm +
                ")\n" +
                resp_msg,
              userid: userid
            }
            );
          }
        );
      });
    } catch (err) {
      rej(err);
    }
  });

async function setData(userid, usernm) {
  headers["Cookie"] =
    cookie + "&empid=" + userid + "&name=" + encodeURI(usernm);
  const dateToFill = await moment()
    .tz("Asia/Taipei")
    .format("YYYY/MM/DD");
  form["measure_date"] = dateToFill;
  form["empid"] = userid;

  return dateToFill;
}
