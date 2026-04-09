## Step 1: Fetch the progress of the batch

```js
fetch("https://api.penpencil.co/uxncc-be-go/stats/v1/batch/684aa87530e932e1745d63a3/subject/progress?page=1&limit=20", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "4.5.3",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "948f0288-e2ea-4cd4-80eb-56503c8a2c10",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-sdk-version": "0.0.16",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
```

### Response

```json
{"success":true,"data":[{"subjectId":"684ab646ecc88c98b1d9e994","totalLectures":15,"completedLectures":1,"inCompleteLectureWeightage":1.44,"submittedDPP":0,"totalDPP":0,"progressPercentage":16},{"subjectId":"684ba376e5d7ff18861a4969","totalLectures":162,"completedLectures":126,"inCompleteLectureWeightage":0.62,"submittedDPP":6,"totalDPP":10,"progressPercentage":77},{"subjectId":"684bc91ce4a8676469b301a7","totalLectures":97,"completedLectures":95,"inCompleteLectureWeightage":0.91,"submittedDPP":1,"totalDPP":15,"progressPercentage":87},{"subjectId":"684ba3cb69cfa946ef2ae9c6","totalLectures":69,"completedLectures":60,"inCompleteLectureWeightage":3.93,"submittedDPP":2,"totalDPP":14,"progressPercentage":79},{"subjectId":"684ba3c90b128f66b4265c91","totalLectures":93,"completedLectures":88,"inCompleteLectureWeightage":2.73,"submittedDPP":0,"totalDPP":12,"progressPercentage":86}],"message":""}
```

## Step 2: Fetch the progress of the subject

```js
fetch("https://api.penpencil.co/uxncc-be-go/stats/v1/batch/684aa87530e932e1745d63a3/subject/684ba376e5d7ff18861a4969/chapter/progress?page=1&enabled=true", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "4.5.3",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "948f0288-e2ea-4cd4-80eb-56503c8a2c10",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-sdk-version": "0.0.16",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
```

### Response

```json
{"success":true,"data":[{"tagId":"6867e11b275dc3e45749d23f","lecturesCompleted":50,"totalLectures":51,"dppCompleted":0,"totalDPP":1},{"tagId":"6867ded81b513e3bd34cac78","lecturesCompleted":9,"totalLectures":9,"dppCompleted":1,"totalDPP":1},{"tagId":"68682bd30391c8008439eb94","lecturesCompleted":0,"totalLectures":0,"dppCompleted":0,"totalDPP":0},{"tagId":"68a89de6b321b35bf675eb69","lecturesCompleted":2,"totalLectures":4,"dppCompleted":0,"totalDPP":0},{"tagId":"6867dfd9d9d46c138817627e","lecturesCompleted":7,"totalLectures":7,"dppCompleted":1,"totalDPP":1},{"tagId":"6867e05cdefd9c29eeaff4c2","lecturesCompleted":11,"totalLectures":11,"dppCompleted":0,"totalDPP":1},{"tagId":"68882f0c1fcbdffac3520a3d","lecturesCompleted":0,"totalLectures":0,"dppCompleted":0,"totalDPP":0},{"tagId":"6867df5487bd77970481d188","lecturesCompleted":8,"totalLectures":8,"dppCompleted":1,"totalDPP":1},{"tagId":"6867df8d275dc3e45749c6cc","lecturesCompleted":4,"totalLectures":4,"dppCompleted":1,"totalDPP":1},{"tagId":"6867e0e29df3ad539b1692e4","lecturesCompleted":2,"totalLectures":2,"dppCompleted":0,"totalDPP":1},{"tagId":"687712736b53d95aa6d44a1d","lecturesCompleted":0,"totalLectures":1,"dppCompleted":0,"totalDPP":0},{"tagId":"68a577b60b2b2b413db7ddcf","lecturesCompleted":1,"totalLectures":1,"dppCompleted":0,"totalDPP":0},{"tagId":"68c289a202594673412cde1f","lecturesCompleted":2,"totalLectures":34,"dppCompleted":0,"totalDPP":0},{"tagId":"6867d530b67f4012373a0a5b","lecturesCompleted":9,"totalLectures":9,"dppCompleted":1,"totalDPP":1},{"tagId":"6867e026600a91565a0e702f","lecturesCompleted":12,"totalLectures":12,"dppCompleted":1,"totalDPP":1},{"tagId":"6867e0a336d09807c9fe5ee0","lecturesCompleted":9,"totalLectures":9,"dppCompleted":0,"totalDPP":1}],"message":""}
```

## Step 3:

```js
fetch("https://api.penpencil.co/batch-service/v1/batch-tags/684aa87530e932e1745d63a3/subject/684ba376e5d7ff18861a4969/topics?page=1&batchTagType=UNITS&limit=20&enabled=true", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "4.5.3",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "948f0288-e2ea-4cd4-80eb-56503c8a2c10",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-sdk-version": "0.0.16",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
```

### Response

```json
{"success":true,"data":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":1,"notes":9,"exercises":1,"videos":9,"lectureVideos":9,"slug":"as-13-accounting-for-investments-982468"},{"_id":"687712736b53d95aa6d44a1d","name":"Introduction to the Subject","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":1,"notes":0,"exercises":0,"videos":1,"lectureVideos":1,"slug":"introduction-to-the-subject-975009"},{"_id":"6867ded81b513e3bd34cac78","name":"Financial Statements of Companies","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":2,"notes":9,"exercises":1,"videos":9,"lectureVideos":9,"slug":"financial-statements-of-companies-022726"},{"_id":"6867df5487bd77970481d188","name":"Cash Flow Statement (AS 3)","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":3,"notes":8,"exercises":1,"videos":8,"lectureVideos":8,"slug":"cash-flow-statement--as-3--965483"},{"_id":"6867df8d275dc3e45749c6cc","name":"Buy Back of Securities","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":4,"notes":4,"exercises":1,"videos":4,"lectureVideos":4,"slug":"buy-back-of-securities-352179"},{"_id":"6867dfd9d9d46c138817627e","name":"Internal Reconstruction","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":5,"notes":7,"exercises":1,"videos":7,"lectureVideos":7,"slug":"internal-reconstruction-573613"},{"_id":"6867e026600a91565a0e702f","name":"Amalgamation including AS 14","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":6,"notes":12,"exercises":1,"videos":12,"lectureVideos":12,"slug":"amalgamation-including-as-14-325292"},{"_id":"6867e05cdefd9c29eeaff4c2","name":"Branch Accounting","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":7,"notes":11,"exercises":1,"videos":11,"lectureVideos":11,"slug":"branch-accounting-451328"},{"_id":"6867e0a336d09807c9fe5ee0","name":"AS 21 Consolidated Financial Statements","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":8,"notes":9,"exercises":1,"videos":9,"lectureVideos":9,"slug":"as-21-consolidated-financial-statements-605737"},{"_id":"6867e0e29df3ad539b1692e4","name":"Framework for Preparation and Presentation of Financial Statements","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":9,"notes":2,"exercises":1,"videos":2,"lectureVideos":2,"slug":"framework-for-preparation-and-presentation-of-financial-statements-505052"},{"_id":"6867e11b275dc3e45749d23f","name":"Accounting Standards","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":10,"notes":51,"exercises":1,"videos":51,"lectureVideos":51,"slug":"accounting-standards-629856"},{"_id":"68a89de6b321b35bf675eb69","name":"Doubt Session","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":70,"notes":0,"exercises":0,"videos":4,"lectureVideos":4,"slug":"doubt-session-133822"},{"_id":"68a577b60b2b2b413db7ddcf","name":"Strategy Session || NO DPP","type":"BATCH_SCHEDULE_VIDEO","typeId":"684ba376e5d7ff18861a4969","displayOrder":80,"notes":1,"exercises":0,"videos":1,"lectureVideos":1,"slug":"strategy-session-||-no-dpp-337584"}],"paginate":{"limit":20,"totalCount":13,"videosCount":128}}
```

## Step 4:

```js
fetch("https://api.penpencil.co/batch-service/v3/batch-subject-schedules/684aa87530e932e1745d63a3/subject/684ba376e5d7ff18861a4969/contents?skip=0&limit=20&contentType=ALL&contentFilter=ALL&tagId=6867d530b67f4012373a0a5b", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "4.5.3",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "948f0288-e2ea-4cd4-80eb-56503c8a2c10",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-sdk-version": "0.0.16",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
```

### Response

```json
{"success":true,"data":[{"type":"LECTURE","_id":"6867e4a9f122c94c3b3d70de","data":{"_id":"6867e4a9f122c94c3b3d70de","dppCount":1,"startTime":"2025-07-05T14:39:00.000Z","endTime":"2025-07-05T14:39:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:39:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/3f6c3eee-45c6-46f9-b62c-0e446f22bd43/master.mpd","exerciseIds":[{"_id":"678f41cefc885ba13e457a1b","title":"AS 13 Accounting for Investments : MCQ Quiz","slug":"as-13-accounting-for-investments---mcq-quiz-942524","dppId":"678f41cee475b38520fdf38c","isSubjective":false,"totalMarks":20,"totalQuestions":20,"smartDPP":false}],"homeworkIds":[{"_id":"686bb1c79626ff4a5c75eced","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 09 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67e389703f76a5922370e927","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/20015777-c0f4-412e-a438-2b2b2400bd80.pdf","name":"AS 13 Accounting for Investments 09 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-09---class-notes---advanced-accounting-378126","status":"Active"}],"topic":"AS 13 Accounting for Investments 09 : Basic Concepts (Part 09) and Questions (Part 08) ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-09---basic-concepts--part-09--and-questions--part-08---304334","status":"PENDING","chapterId":"678f40fd96133b2eeb5360d5","isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67e384c61095130e0ab1ad14","id":"67e384c61095130e0ab1ad14","name":"AS 13 Accounting for Investments 09 : Basic Concepts (Part 09) and Questions (Part 08) || Class Notes and Download option will be provided soon","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/5d40a60c-aebf-4465-80a8-5448c7cdd8d9.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/3f6c3eee-45c6-46f9-b62c-0e446f22bd43/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:05:30","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-26T04:38:30.762Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e4a9f122c94c3b3d70de"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e49661028091e7220761","data":{"_id":"6867e49661028091e7220761","dppCount":0,"startTime":"2025-07-05T14:38:00.000Z","endTime":"2025-07-05T14:38:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:38:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/07508584-d780-4906-becb-debd3974151a/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb1b3b570db7b63841924","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 08 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67e2a37723dcf5638454861c","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/175e70f3-804a-47d9-9a31-91d776b9f785.pdf","name":"AS 13 Accounting for Investments 08  Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-08---class-notes---advanced-accounting-055618","status":"Active"}],"topic":"AS 13 Accounting for Investments 08 : Basic Concepts (Part 08) and Questions (Part 07) ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-08---basic-concepts--part-08--and-questions--part-07---634257","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67e2afa2903a71fc603674cf","id":"67e2afa2903a71fc603674cf","name":"AS 13 Accounting for Investments 08 : Basic Concepts (Part 08) and Questions (Part 07) || Rescheduled @3:45PM || download option will be provided soon","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/8521253e-8f1e-45f5-9c43-6c936288bfaa.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/07508584-d780-4906-becb-debd3974151a/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:17:18","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-25T13:29:06.536Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e49661028091e7220761"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e482673ebe7325a49bc5","data":{"_id":"6867e482673ebe7325a49bc5","dppCount":0,"startTime":"2025-07-05T14:37:00.000Z","endTime":"2025-07-05T14:37:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:37:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/972ac461-cca9-4263-8359-9f27e69284f4/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb19b415402bd9cc4078c","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 07 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67e0e9976365b6c1919bd0d7","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/57487c9b-1f51-45f3-a118-8ea8ac5d66bf.pdf","name":"AS 13 Accounting for Investments 07 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-07---class-notes---advanced-accounting-317022","status":"Active"}],"topic":"AS 13 Accounting for Investments 07 : Basic Concepts (Part 07) and Questions (Part 06) ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-07---basic-concepts--part-07--and-questions--part-06---514005","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67e0e522aa133dc813b1f8a1","id":"67e0e522aa133dc813b1f8a1","name":"AS 13 Accounting for Investments 07 : Basic Concepts (Part 07) and Questions (Part 06)","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/d0823fcc-ce31-42f4-beeb-45b1f265df9f.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/972ac461-cca9-4263-8359-9f27e69284f4/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:21:18","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-24T04:52:50.978Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e482673ebe7325a49bc5"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e4334385d554c3274ab7","data":{"_id":"6867e4334385d554c3274ab7","dppCount":0,"startTime":"2025-07-05T14:36:00.000Z","endTime":"2025-07-05T14:36:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:36:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/1e8bec00-2b15-41a1-a2af-47efbc2d76c4/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb183c85652c9dbcc84d5","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 06 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67de44de33f27aeb807f0dd1","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/5105a928-f9cd-4013-94ab-94a2497512f2.pdf","name":"AS 13 Accounting for Investments 06 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-06---class-notes---advanced-accounting-962867","status":"Active"}],"topic":"AS 13 Accounting for Investments 06 : Basic Concepts (Part 06) and Questions (Part 05) ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-06---basic-concepts--part-06--and-questions--part-05---706447","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67de41afd6cbc00efd22c147","id":"67de41afd6cbc00efd22c147","name":"AS 13 Accounting for Investments 06 : Basic Concepts (Part 06) and Questions (Part 04) || Class Notes and Download option will be provided soon","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/dda519e5-3465-4d26-a11d-46d36e667371.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/1e8bec00-2b15-41a1-a2af-47efbc2d76c4/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:15:48","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-22T04:50:55.432Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e4334385d554c3274ab7"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e41e6ce94f5a82eab45d","data":{"_id":"6867e41e6ce94f5a82eab45d","dppCount":0,"startTime":"2025-07-05T14:35:00.000Z","endTime":"2025-07-05T14:35:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:35:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/4d1a0242-c5fb-4411-be34-9b662adb90b9/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb16cc1a690f39431f4b7","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 05 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67dd8488076120eeffc99f93","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/6d40f641-e744-4753-ba54-9a5b0d9fc51f-small.pdf","name":"AS 13 Accounting for Investments 05  Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-05---class-notes---advanced-accounting-069430","status":"Active"}],"topic":"AS 13 Accounting for Investments 05 : Basic Concepts (Part 05) and Questions (Part 04)","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-05---basic-concepts--part-05--and-questions--part-04--194389","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67dd83017867c7372145eb42","id":"67dd83017867c7372145eb42","name":"AS 13 Accounting for Investments 05 : Basic Concepts (Part 05) and Questions (Part 04) || Rescheduled @6:30PM","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/043455f8-76fa-4013-8b94-1ed70d666db3.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/4d1a0242-c5fb-4411-be34-9b662adb90b9/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:16:16","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-21T15:17:21.294Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e41e6ce94f5a82eab45d"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e3ff61028091e7220283","data":{"_id":"6867e3ff61028091e7220283","dppCount":0,"startTime":"2025-07-05T14:34:00.000Z","endTime":"2025-07-05T14:34:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:34:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/978b6371-26be-4df8-9a64-0c65ad8de399/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb1533c1c47e8e02ef922","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 04 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67dba18e578993c3a0736624","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/7a0ff855-e349-4027-9998-b664fd5fff8e.pdf","name":"AS 13 Accounting for Investments 04 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-04---class-notes---advanced-accounting-147506","status":"Active"}],"topic":"AS 13 Accounting for Investments 04 : Basic Concepts (Part 04) and Questions (Part 03)","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-04---basic-concepts--part-04--and-questions--part-03--605666","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67db9e3bed5c34236155c40f","id":"67db9e3bed5c34236155c40f","name":"AS 13 Accounting for Investments 04 : Basic Concepts (Part 04) and Questions (Part 03) || Class Notes and Download option will be provided soon","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/2e687570-029b-4977-a0fd-aa995851ac0e.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/978b6371-26be-4df8-9a64-0c65ad8de399/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:18:16","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-20T04:48:59.090Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e3ff61028091e7220283"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e3eb6ce94f5a82eab2eb","data":{"_id":"6867e3eb6ce94f5a82eab2eb","dppCount":0,"startTime":"2025-07-05T14:33:00.000Z","endTime":"2025-07-05T14:33:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:33:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/68fb993d-e3dc-44a5-85ac-6cd550a01257/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"686bb13e415402bd9cc40291","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 03 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67da4eb111e801a2fd879858","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/7d589f0a-dcf5-4eab-ac40-dc6ca5762bf5.pdf","name":"AS 13 Accounting for Investments 03 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-03---class-notes---advanced-accounting-890006","status":"Active"}],"topic":"AS 13 Accounting for Investments 03 : Basic Concepts (Part 03) and Questions (Part 02) ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-03---basic-concepts--part-03--and-questions--part-02---846664","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67da4adca469c2322eda50ec","id":"67da4adca469c2322eda50ec","name":"AS 13 Accounting for Investments 03 : Basic Concepts (Part 03) and Questions (Part 02)","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/0bacfc79-a4b7-471a-a38d-68b133fb2e2d.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/68fb993d-e3dc-44a5-85ac-6cd550a01257/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p>live to vod</p>\n</body>\n</html>","duration":"02:09:52","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-19T04:41:00.264Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e3eb6ce94f5a82eab2eb"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e3d1e86c5471c97d5634","data":{"_id":"6867e3d1e86c5471c97d5634","dppCount":0,"startTime":"2025-07-05T14:32:00.000Z","endTime":"2025-07-05T14:32:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:32:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/ac77ac28-337d-4e82-86f0-ab434de4f36a/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"68694fab48727255a16a3d83","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 02 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67d8fe739dc75ad4fcc8f79d","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/7ca71611-99e2-4e29-a60f-7a5f62c6941c.pdf","name":"AS 13 Accounting for Investments 02 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-02---class-notes---advanced-accounting-317456","status":"Active"}],"topic":"AS 13 Accounting for Investments 02 : Basic Concepts (Part 02) and Questions","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-02---basic-concepts--part-02--and-questions-270382","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67d9083041dce616398adeff","id":"67d9083041dce616398adeff","name":"CA Inter Jan 2026 Advanced Accounting_ AS 13 Accounting For Inv. __ Udesh Regular Batch Demo Lecture (1)","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/7a4271bb-d3fa-4845-a7ce-0b0f24763754.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/ac77ac28-337d-4e82-86f0-ab434de4f36a/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>","duration":"02:15:14","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-18T05:44:16.703Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e3d1e86c5471c97d5634"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}},{"type":"LECTURE","_id":"6867e3a84385d554c327455f","data":{"_id":"6867e3a84385d554c327455f","dppCount":0,"startTime":"2025-07-05T14:31:00.000Z","endTime":"2025-07-05T14:31:00.000Z","restrictedSchedule":false,"restrictedTime":0,"batchSubjectId":"684ba376e5d7ff18861a4969","date":"2025-07-05T14:31:00.000Z","teachers":["63b916819ab32a0018ce9b71"],"urlType":"penpencilvdo","url":"https://d1d34p8vz63oiq.cloudfront.net/drm/e13c3905-933d-4230-ba12-bea51a7ad2f7/master.mpd","exerciseIds":[],"homeworkIds":[{"_id":"68682c1a83023f1b3c6fa670","actions":["Open","Download","Print"],"topic":"AS 13 Accounting for Investments 01 : Class Notes ~ Advanced Accounting","note":"Class Notes","attachmentIds":[{"_id":"67d7b135d730a3f7f1009841","baseUrl":"https://static.pw.live/","key":"5eb393ee95fab7468a79d189/ADMIN/5b2b7382-9963-405e-ba55-3cdea0b0bb83.pdf","name":"AS 13 Accounting for Investments 01 Class Notes.pdf"}],"batchSubjectId":"684ba376e5d7ff18861a4969","solutionVideoType":"none","solutionVideoUrl":null,"slug":"as-13-accounting-for-investments-01---class-notes---advanced-accounting-396952","status":"Active"}],"topic":"AS 13 Accounting for Investments 01 : Course Introduction and Basic Concepts ","isFree":false,"scheduleCode":"EXPIRED","lectureType":"RECORDED","scheduleType":"penpencilvdo","lowDataMode":false,"slug":"as-13-accounting-for-investments-01---course-introduction-and-basic-concepts--620365","status":"PENDING","chapterId":null,"isBatchDoubtEnabled":false,"day":5,"videoDetails":{"_id":"67d7b4ac9795404e7f97f1f7","id":"67d7b4ac9795404e7f97f1f7","name":"CA Inter Jan 2026 Advanced Accounting_ AS 13 Accounting For Inv. __ Udesh Regular Batch Demo Lecture","image":"https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/f812e114-5c33-41c8-87c1-64309faf0ced.png","videoUrl":"https://d1d34p8vz63oiq.cloudfront.net/drm/e13c3905-933d-4230-ba12-bea51a7ad2f7/master.mpd","description":"<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>","duration":"02:18:19","status":"Ready","types":["DASH","HLS"],"createdAt":"2025-03-17T05:35:40.979Z","drmVendor":"Pallycon","drmProtected":true,"isZipDownloadEnabled":true,"findKey":"6867e3a84385d554c327455f"},"subjectId":{},"tags":[{"_id":"6867d530b67f4012373a0a5b","name":"AS 13 Accounting for Investments"}],"videoAnalytics":{"isConvivaEnabled":false},"isSingleScheduling":true,"isVideoLecture":true,"hasAttachment":true,"isDPPVideos":false,"isDPPNotes":false,"batchId":"684aa87530e932e1745d63a3","previewImageUrl":"","previewImageUrlMWeb":"","dppScheduleId":null,"isParentSchedule":true,"classActiveTime":null,"classEndTime":null,"meetingId":"","zoomCohostId":[],"zoomHostId":null,"isChatEnabled":false,"timeline":[],"contentType":[],"conversationId":null,"isPathshala":false,"isDoubtEnabled":true,"isCopilotEnabled":false,"isCopilotDoubtAllocationEnabled":false,"isCommentDisabled":false,"dRoomId":null,"isAskSaarthiEnabled":false,"isContentSecurityEnabled":false,"isEmojiEnabled":false,"isNoteDisabled":false,"isRecordingEnabled":false,"isShareable":false,"uWebSocketEnabled":false,"isSimulatedLecture":false,"hinglishScheduleId":"","classTeaserUrl":"","videoContentId":null,"teacherImage":""}}]}
```

## Step 5:

```js
fetch("https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=6867e3ff61028091e7220283&parentId=684aa87530e932e1745d63a3&clientVersion=201", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "audiocodeccapability": "{\"AAC-LC\":{\"isSupported\":true,\"Profile\":[{\"container\":\"audio/mp4\",\"supported\":true},{\"container\":\"audio/webm\",\"supported\":false},{\"container\":\"audio/ogg\",\"supported\":false}]},\"HE-AAC v1\":{\"isSupported\":true,\"Profile\":[{\"container\":\"audio/mp4\",\"supported\":true},{\"container\":\"audio/webm\",\"supported\":false},{\"container\":\"audio/ogg\",\"supported\":false}]},\"HE-AAC v2\":{\"isSupported\":true,\"Profile\":[{\"container\":\"audio/mp4\",\"supported\":true},{\"container\":\"audio/webm\",\"supported\":false},{\"container\":\"audio/ogg\",\"supported\":false}]}}",
    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc",
    "cache-control": "no-cache",
    "client-id": "5eb393ee95fab7468a79d189",
    "client-type": "WEB",
    "client-version": "200",
    "content-type": "application/json",
    "devicememory": "8192",
    "devicestreamingtechnology": "{\"dash\":{\"isSupported\":true,\"formats\":[\"mp4\",\"m4a\"],\"codecs\":[\"avc1\",\"aac\"]},\"hls\":{\"isSupported\":false,\"formats\":[],\"codecs\":[]}}",
    "devicetype": "desktop",
    "drmcapability": "{\"aesSupport\":\"yes\",\"fairPlayDrmSupport\":\"no\",\"playreadyDrmSupport\":\"no\",\"widevineDRMSupport\":\"yes\"}",
    "frameratecapability": "{\"videoQuality\":\"720p (HD)\"}",
    "networktype": "3g",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "randomid": "948f0288-e2ea-4cd4-80eb-56503c8a2c10",
    "screenresolution": "1600 x 1000",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "videocodeccapability": "{\"Hevc\":{\"isSupported\":\"false\",\"Profile\":[]},\"AV1\":{\"isSupported\":\"true\",\"Profile\":[{\"name\":\"Main\"},{\"name\":\"High\"},{\"name\":\"Professional\"}]}}",
    "Referer": "https://www.pw.live/"
  },
  "body": null,
  "method": "GET"
});
```

### Response

```json
{"success":true,"data":{"url":"https://sec-prod-mediacdn.pw.live/drm/978b6371-26be-4df8-9a64-0c65ad8de399/master.mpd","signedUrl":"?URLPrefix=aHR0cHM6Ly9zZWMtcHJvZC1tZWRpYWNkbi5wdy5saXZlL2RybS85NzhiNjM3MS0yNmJlLTRkZjgtOWE2NC0wYzY1YWQ4ZGUzOTk&Expires=1774441628&KeyName=pw-prod-key&Signature=EDh2DqQI5WfSFNl4hKy0loufSw6Zhke_NYrcvZP-0oT1yAwmdCAMMwJ-nfqtZfpGgiPdwqnR-lLdygcYWMEAAg","urlType":"penpencilvdo","scheduleInfo":{"startTime":"2025-07-05T14:34:00.000Z","endTime":"2025-07-05T14:34:00.000Z"},"drmDetails":{"licenseUrl":"https://api.penpencil.co/v1/videos/drm-license-manager","licenseToken":"eyJkcm1fdHlwZSI6IldpZGV2aW5lIiwic2l0ZV9pZCI6IkZUVEsiLCJ1c2VyX2lkIjoiNjg2NDBlOGE0MjRlZDlmZWI3NjUxNDFkIiwiY2lkIjoiYmI5NjYzNDc5YmJiNTY0MzhlNzMzMmVkNDkzOGZmOTkiLCJwb2xpY3kiOiI1MTNFNDU2dS9FTi9nSkR6RUE5a3hXQk4vcUt4czlaVEgwdmNEdGJ6U3p1WHlaY0t0YVVVeGw1ellqeVQrTm5BTXVLYXBpdkNpQTRuV1FWMkZaYTNhTndzVFNxNVRaQm15UzRnODJJTGgwNGtBRGRZM0hJYi9US2hodmV3c2R6QWVleGc2amtTUUk5amV0S3ZkVXZVSU5WVlpRanFMMHM5dmY2empObUZKS2p1bi92emUrUUJtcGE1ZzZRWDlkK29jSW02SFpjUWhMOHdZSXd0cElkM1h2d2RKRU9vWlVtN3ROMnZSVlRIT0kweVJoclBDRGh4YzFabUZuRjVKdGovdnY4Rm0vdjBSN1Vpb2lQdG44c3lrVVB0UmhkOGxLc0NiRHN5SUJHV1djZmg1dGpOdHBNUnJ4Uks2aFVoWGpBUzI1TEdYOGtlVDFDZUFSYlJxSEU3RWVVKzNobVJlU2phNUJRbEt0SkhoVU55Q0U1VnJLcnhuSnp2VnBrZFBzWGFQRG5jYWM1ZTBCWHcwclJTS2dkNzE5R0pzRFlmSlFSdUxUQkd5RGJ4WjVqMTNyRVNuQnllRnM0TWxHdnkwV3pSTXdFZm9CdW1aY0lnN3V6Y1p5MmRwQU9UWHlid21qWkx2SGU0Q0NSeTZIa01aLzdUb3NLeXFQWnNJeDBDQnNMdyIsInRpbWVzdGFtcCI6IjIwMjYtMDMtMjVUMDg6Mjc6MDguOTAzWiIsImhhc2giOiJOMG5GSWhsdjdydk9QQzRXWWh5ejdQQU5pYTZwRDJYRFB3MmltVEp0bHY0PSIsInJlc3BvbnNlX2Zvcm1hdCI6Im9yaWdpbmFsIiwia2V5X3JvdGF0aW9uIjpmYWxzZX0=","drmType":"Widevine","drmVendor":"Pallycon","licenseDuration":1774438028903,"contentId":"bb9663479bbb56438e7332ed4938ff99"},"videoContainer":"DASH","isCmaf":false,"serverTime":1774427228914,"cdnType":"Gcp"},"dataFrom":"Media Api Service"}
```



## Step 6: Get MPD

```js
fetch("https://sec-prod-mediacdn.pw.live/drm/978b6371-26be-4df8-9a64-0c65ad8de399/master.mpd?URLPrefix=aHR0cHM6Ly9zZWMtcHJvZC1tZWRpYWNkbi5wdy5saXZlL2RybS85NzhiNjM3MS0yNmJlLTRkZjgtOWE2NC0wYzY1YWQ4ZGUzOTk&Expires=1774442831&KeyName=pw-prod-key&Signature=4jKHT1HzXtV88ttaYMC5NdKEFtFId3crbUdsXjcOCDZg59HZHTN_oMymzsgJA2NdTeaExfp44HOm2z9XB6G3Dw", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://www.pw.live/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
```

### Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--Generated with https://github.com/google/shaka-packager version v2.6.1-634af65-release-->
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd" xmlns:cenc="urn:mpeg:cenc:2013" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT2S" type="static" mediaPresentationDuration="PT8296S">
  <Period id="0">
    <AdaptationSet id="0" contentType="video" maxWidth="1280" maxHeight="720" frameRate="90000/3600" segmentAlignment="true" par="16:9">
      <ContentProtection value="cenc" schemeIdUri="urn:mpeg:dash:mp4protection:2011" cenc:default_KID="6ff81216-78c1-9a0f-c07a-66fc0a5f972c"/>
      <ContentProtection schemeIdUri="urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
        <cenc:pssh>AAAAaHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAAEgIARIQb/gSFnjBmg/Aemb8Cl+XLBoMaW5rYWVudHdvcmtzIiBiYjk2NjM0NzliYmI1NjQzOGU3MzMyZWQ0OTM4ZmY5OSoCSEQ=</cenc:pssh>
      </ContentProtection>
      <Representation id="0" bandwidth="370830" codecs="avc1.4d4015" mimeType="video/mp4" sar="1:1" width="426" height="240">
        <SegmentTemplate timescale="90000" presentationTimeOffset="2970" initialization="dash/240/init.mp4" media="dash/240/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="2970" d="360000" r="2073"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
      <Representation id="1" bandwidth="1056274" codecs="avc1.4d401e" mimeType="video/mp4" sar="1:1" width="854" height="480">
        <SegmentTemplate timescale="90000" presentationTimeOffset="2970" initialization="dash/480/init.mp4" media="dash/480/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="2970" d="360000" r="2073"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
      <Representation id="2" bandwidth="787710" codecs="avc1.4d401e" mimeType="video/mp4" sar="1:1" width="640" height="360">
        <SegmentTemplate timescale="90000" presentationTimeOffset="2970" initialization="dash/360/init.mp4" media="dash/360/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="2970" d="360000" r="2073"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
      <Representation id="3" bandwidth="2103486" codecs="avc1.4d401f" mimeType="video/mp4" sar="1:1" width="1280" height="720">
        <SegmentTemplate timescale="90000" presentationTimeOffset="2970" initialization="dash/720/init.mp4" media="dash/720/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="2970" d="360000" r="2073"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
    <AdaptationSet id="1" contentType="audio" segmentAlignment="true">
      <ContentProtection value="cenc" schemeIdUri="urn:mpeg:dash:mp4protection:2011" cenc:default_KID="6ff81216-78c1-9a0f-c07a-66fc0a5f972c"/>
      <ContentProtection schemeIdUri="urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed">
        <cenc:pssh>AAAAaHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAAEgIARIQb/gSFnjBmg/Aemb8Cl+XLBoMaW5rYWVudHdvcmtzIiBiYjk2NjM0NzliYmI1NjQzOGU3MzMyZWQ0OTM4ZmY5OSoCSEQ=</cenc:pssh>
      </ContentProtection>
      <Representation id="4" bandwidth="67713" codecs="mp4a.40.2" mimeType="audio/mp4" audioSamplingRate="48000">
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="2"/>
        <SegmentTemplate timescale="48000" presentationTimeOffset="1584" initialization="dash/audio/init.mp4" media="dash/audio/$Number$.mp4" startNumber="1">
          <SegmentTimeline>
            <S t="0" d="192512"/>
            <S t="192512" d="191488"/>
            <S t="384000" d="192512"/>
            ---------------
            <S t="398016512" d="191488"/>
            <S t="398208000" d="2048"/>
          </SegmentTimeline>
        </SegmentTemplate>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```


## Step 7: Get Decrypt Key

```js
fetch("https://cdrm-project.com/api/decrypt", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"141\", \"Not?A_Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://cdrm-project.com/",
  "body": "{\"pssh\":\"AAAAaHBzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAAEgIARIQb/gSFnjBmg/Aemb8Cl+XLBoMaW5rYWVudHdvcmtzIiBiYjk2NjM0NzliYmI1NjQzOGU3MzMyZWQ0OTM4ZmY5OSoCSEQ=\",\"licurl\":\"https://api.penpencil.co/v1/videos/drm-license-manager\",\"proxy\":\"\",\"headers\":\"{\\\"accept\\\":\\\"*/*\\\",\\\"accept-language\\\":\\\"en-US,en;q=0.9\\\",\\\"authorization\\\":\\\"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NzQ4MDYyODAuNTUxLCJkYXRhIjp7Il9pZCI6IjY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsInVzZXJuYW1lIjoiODAxNjk4MDcxOCIsImZpcnN0TmFtZSI6IlJha2VzaCIsImxhc3ROYW1lIjoiRGFzIiwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlYjM5M2VlOTVmYWI3NDY4YTc5ZDE4OSIsIndlYnNpdGUiOiJwaHlzaWNzd2FsbGFoLmNvbSIsIm5hbWUiOiJQaHlzaWNzd2FsbGFoIn0sImVtYWlsIjoibmFiaW5tYWw1OTVAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiJ4dEdva2dFclR6ZTV3NmhPWUNYWE5BXzY4NjQwZThhNDI0ZWQ5ZmViNzY1MTQxZCIsImlhdCI6MTc3NDIwMTQ4MH0.50gaWYmoU_PVXaNGLDH_HwG3S80UgjHJDesP2RtxAoc\\\",\\\"cache-control\\\":\\\"no-cache\\\",\\\"content-type\\\":\\\"application/octet-stream\\\",\\\"pallycon-customdata-v2\\\":\\\"eyJkcm1fdHlwZSI6IldpZGV2aW5lIiwic2l0ZV9pZCI6IkZUVEsiLCJ1c2VyX2lkIjoiNjg2NDBlOGE0MjRlZDlmZWI3NjUxNDFkIiwiY2lkIjoiYmI5NjYzNDc5YmJiNTY0MzhlNzMzMmVkNDkzOGZmOTkiLCJwb2xpY3kiOiI1MTNFNDU2dS9FTi9nSkR6RUE5a3hXQk4vcUt4czlaVEgwdmNEdGJ6U3p1WHlaY0t0YVVVeGw1ellqeVQrTm5BTXVLYXBpdkNpQTRuV1FWMkZaYTNhTndzVFNxNVRaQm15UzRnODJJTGgwNGtBRGRZM0hJYi9US2hodmV3c2R6QWVleGc2amtTUUk5amV0S3ZkVXZVSU5WVlpRanFMMHM5dmY2empObUZKS2p1bi92emUrUUJtcGE1ZzZRWDlkK29jSW02SFpjUWhMOHdZSXd0cElkM1h2d2RKRU9vWlVtN3ROMnZSVlRIT0kweVJoclBDRGh4YzFabUZuRjVKdGovdnY4Rm0vdjBSN1Vpb2lQdG44c3lrVVB0UmhkOGxLc0NiRHN5SUJHV1djZmg1dGpOdHBNUnJ4Uks2aFVoWGpBUzI1TEdYOGtlVDFDZUFSYlJxSEU3RWVVKzNobVJlU2phNUJRbEt0SkhoVU55Q0U1VnJLcnhuSnp2VnBrZFBzWGFQRG5jYWM1ZTBCWHcwclJTS2dkNzE5R0pzRFlmSlFSdUxUQkd5RGJ4WjVqMTNyRVNuQnllRnM0TWxHdnkwV3pSTXdFZm9CdW1aY0lnN3V6Y1p5MmRwQU9UWHlid21qWkx2SGU0Q0NSeTZIa01aLzdUb3NLeXFQWnNJeDBDQnNMdyIsInRpbWVzdGFtcCI6IjIwMjYtMDMtMjVUMDk6MDI6MDkuMDU3WiIsImhhc2giOiJ4NGdLNHorMDlnZ3dyZGRUMkwyYzJZMUJCTzYyOEZGcGhTZnNDSG1zNUV3PSIsInJlc3BvbnNlX2Zvcm1hdCI6Im9yaWdpbmFsIiwia2V5X3JvdGF0aW9uIjpmYWxzZX0=\\\",\\\"pragma\\\":\\\"no-cache\\\",\\\"priority\\\":\\\"u=1, i\\\",\\\"sec-ch-ua\\\":\\\"\\\\\\\"Chromium\\\\\\\";v=\\\\\\\"141\\\\\\\", \\\\\\\"Not?A_Brand\\\\\\\";v=\\\\\\\"8\\\\\\\"\\\",\\\"sec-ch-ua-mobile\\\":\\\"?0\\\",\\\"sec-ch-ua-platform\\\":\\\"\\\\\\\"Linux\\\\\\\"\\\",\\\"sec-fetch-dest\\\":\\\"empty\\\",\\\"sec-fetch-mode\\\":\\\"cors\\\",\\\"sec-fetch-site\\\":\\\"cross-site\\\"}\",\"cookies\":\"\",\"data\":\"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\",\"device\":\"default\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
```

### Response

```json
{
  "message": "6ff8121678c19a0fc07a66fc0a5f972c:d32d958cb307f1acdb493855ce1812c4",
  "status": "success"
}
```