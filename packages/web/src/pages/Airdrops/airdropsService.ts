export type IDelegateeInfo = {
  icon?: string;
  address: string;
  name: string;
  twitterProfile: string;
  description: string;
};

/**
 * Gets the delegatees
 */
export async function getDelegatees(): Promise<IDelegateeInfo[]> {
  try {
    return [
      {
        address: "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F",
        name: "Chapeu #1",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0xaFd8C4f6f5f0d64f0e8bcE4C22DAa7b575506400",
        name: "Chapeu #2",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
          </ul>
        `,
      },
      {
        address: "0x56E889664F5961452E5f4183AA13AF568198eaD2",
        name: "Chapeu #3",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        name: "Zero #1",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000001",
        name: "Zero #2",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000002",
        name: "Zero #3",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
    ];
  } catch (error) {
    console.log(error);
    return [];
  }
}
