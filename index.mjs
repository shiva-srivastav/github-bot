// Import required packages
import jsonfile from 'jsonfile'; // For writing JSON files
import moment from 'moment'; // For date manipulation
import random from 'random'; // For generating random numbers
import simpleGit from 'simple-git'; // For Git operations

const FILE_PATH = './data.json'; // Path to the JSON file that will be committed

// Recursive function to make multiple commits with random dates
const makeCommit = (n) => {
  // Base case: if n=0, push all commits and stop
  if (n === 0) return simpleGit().push();

  // Generate random week (0-54) and day (0-6) offsets
  const x = random.int(0, 54); // Random week within roughly last year
  const y = random.int(0, 6); // Random day within a week

  // Create a date starting from 1 year ago, then add random weeks and days
  const DATE = moment()
    .subtract(1, 'y') // Start from 1 year ago
    .add(1, 'd') // Add 1 day
    .add(x, 'w') // Add random weeks
    .add(y, 'd') // Add random days
    .format(); // Format as string

  // Create data object with the generated date
  const data = {
    date: DATE,
  };

  console.log(DATE);

  // Write the date to JSON file and create a Git commit
  jsonfile.writeFile(FILE_PATH, data, () => {
    simpleGit()
      .add([FILE_PATH]) // Stage the file
      .commit(
        DATE, // Use date as commit message
        { '--date': DATE }, // Set commit date
        makeCommit.bind(this, --n)
      ); // Recursive call with n-1
  });
};

/**
 * Creates a commit on a specific date
 * @param {string} specificDate - Date in 'YYYY-MM-DD' format (e.g., '2024-02-22')
 * @param {string} message - Commit message (optional)
 * @returns {Promise} - Resolves when commit is complete
 */
const commitOnDate = async (specificDate, message = 'Commit') => {
  try {
    // Validate and format the date
    const DATE = moment(specificDate).format();

    // Create data to be written
    const data = {
      date: DATE,
      message: message,
    };

    // Write to file and create commit
    await jsonfile.writeFile(FILE_PATH, data);

    const git = simpleGit();
    await git.add([FILE_PATH]).commit(message, {
      '--date': DATE,
    });

    console.log(`Successfully created commit on ${specificDate}`);

    // Optionally push the commit
    // await git.push();
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
};

// Example usage:
// For random commits:
// makeCommit(1);    // Creates 1 random commit in the past year

// For specific date commit:
commitOnDate('2024-02-20', 'Special commit on missed day');
commitOnDate('2024-02-20', 'Special commit on missed day');
commitOnDate('2024-02-20', 'Special commit on missed day');
// Example of using both:
// async function makeMultipleCommits() {
//     await makeCommit(2);  // First make 2 random commits
//     await commitOnDate('2024-01-01', 'New Year commit');  // Then make a specific date commit
// }
