import nock from "nock";

const nockBack = nock.back;
const fixturesPath = process.cwd() + "/__nock-fixtures__";

nockBack.fixtures = fixturesPath;

if (process.env.NOCK_BACK_MODE) {
  console.log({
    NOCK_BACK_MODE: process.env.NOCK_BACK_MODE,
  });
}

nockBack.setMode((process.env.NOCK_BACK_MODE as nock.BackMode) || "lockdown");

export { nockBack };

export async function createNockDone(expect: jest.Expect) {
  const { currentTestName } = expect.getState();
  return nockBack(currentTestName + ".json").then(({ nockDone }) => nockDone);
}
