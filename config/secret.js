module.exports = {
    database: process.env.DB_URI  || 'mongodb://heroku_1l2nfm1n:rlgm0esk7r9jp8hhei8m61gcsv@ds147746.mlab.com:47746/heroku_1l2nfm1n',
    port: process.env.PORT || 3000,
    secretKey: "dba383002e3e50b44108dd6a6f2a0327",
    sendgrid_key: "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",
    facebook: {
        clientID: '373862159895119',
        clientSecret: 'dba383002e3e50b44108dd6a6f2a0327',
        profileFields: ['emails', 'displayName'],
        callbackURL: process.env.FB_URI || 'http://localhost:3000/auth/facebook/callback'
    },
  googleConfig: {
      clientId: process.env.GOOGLE_CLIENT_ID || '', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'AIzaSyABTwbhRT_jGYsyOWpcgBetxhatCZygcVw', // e.g. _ASDFA%DFASDFASDFASD#FAD-
      redirect: process.env.GOOGLE_REDIRECT_URL  || 'http://localhost:3000/auth/google/callback', // this must match your google api settings
  },
  defaultScope: [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
]
};