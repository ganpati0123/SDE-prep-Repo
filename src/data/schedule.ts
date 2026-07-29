export interface ScheduleBlock {
  id: string
  name: string
  type: 'study' | 'break' | 'meal' | 'sleep'
  startHour: number
  startMinute: number
  durationMinutes: number
  topic?: string
  description?: string
}

export interface DSAQuestion {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  leetcodeUrl?: string
  starterCode?: string
  testCases?: { input: string; expected: string }[]
}

export interface DaySchedule {
  dayNumber: number
  date: string
  phase: number
  phaseName: string
  dsaTopic: string
  fundamentalsTopic: string
  revisionDays: number[]
  blocks: ScheduleBlock[]
  questions: DSAQuestion[]
  notes?: string
}

export const PLAN_START_DATE = new Date(2025, 6, 30) // July 30, 2025

export const PHASES = [
  { number: 1, name: 'Foundation Rebuild', days: '1-12', color: '#3b82f6' },
  { number: 2, name: 'Core DSA Depth', days: '13-37', color: '#10b981' },
  { number: 3, name: 'Graphs + DP', days: '38-46', color: '#f59e0b' },
  { number: 4, name: 'Advanced Wrap + LLD/HLD', days: '47-53', color: '#ef4444' },
  { number: 5, name: 'Interview Ready', days: '54-55', color: '#a855f7' },
]

const FUNDAMENTALS_ROTATION = [
  'System Design Basics + Computer Fundamentals',
  'OOP',
  'OS',
  'DBMS',
  'Computer Networks',
  'SQL (queries, joins, window functions)',
]

function getFundamentals(day: number): string {
  return FUNDAMENTALS_ROTATION[day % 6]
}

function getRevisionDays(day: number): number[] {
  const days: number[] = []
  if (day > 3) days.push(day - 3)
  if (day > 7) days.push(day - 7)
  if (day > 15) days.push(day - 15)
  if (day > 30) days.push(day - 30)
  return days
}

function getDateForDay(day: number): string {
  const date = new Date(PLAN_START_DATE)
  date.setDate(date.getDate() + day - 1)
  return date.toISOString().split('T')[0]
}

function getPhase(day: number): { number: number; name: string } {
  if (day <= 12) return { number: 1, name: 'Foundation Rebuild' }
  if (day <= 37) return { number: 2, name: 'Core DSA Depth' }
  if (day <= 46) return { number: 3, name: 'Graphs + DP' }
  if (day <= 53) return { number: 4, name: 'Advanced Wrap + LLD/HLD' }
  return { number: 5, name: 'Interview Ready' }
}

// Standard daily time blocks (same structure every day)
function createBlocks(dsaTopic: string, fundamentalsTopic: string, revisionTopics: string): ScheduleBlock[] {
  return [
    { id: 'wake', name: 'Wake + Freshen Up', type: 'break', startHour: 5, startMinute: 30, durationMinutes: 30 },
    { id: 'block1', name: 'Block 1 — New Topic', type: 'study', startHour: 6, startMinute: 0, durationMinutes: 180, topic: dsaTopic, description: 'Learn + solve today\'s DSA topic' },
    { id: 'breakfast', name: 'Breakfast', type: 'meal', startHour: 9, startMinute: 0, durationMinutes: 30 },
    { id: 'block2', name: 'Block 2 — DSA Practice', type: 'study', startHour: 9, startMinute: 30, durationMinutes: 180, topic: dsaTopic, description: 'Active practice: today + yesterday topic problems' },
    { id: 'lunch', name: 'Lunch', type: 'meal', startHour: 12, startMinute: 30, durationMinutes: 30 },
    { id: 'block3', name: 'Block 3 — Fundamentals', type: 'study', startHour: 13, startMinute: 0, durationMinutes: 90, topic: fundamentalsTopic, description: 'Fundamentals rotation' },
    { id: 'block4', name: 'Block 4 — Spaced Revision', type: 'study', startHour: 14, startMinute: 30, durationMinutes: 120, topic: revisionTopics, description: 'Revise 3/7/15/30 days back' },
    { id: 'break2', name: 'Break', type: 'break', startHour: 16, startMinute: 30, durationMinutes: 20 },
    { id: 'block5', name: 'Block 5 — DSA Continued', type: 'study', startHour: 16, startMinute: 50, durationMinutes: 180, topic: dsaTopic, description: 'DSA practice continued' },
    { id: 'dinner', name: 'Dinner', type: 'meal', startHour: 19, startMinute: 50, durationMinutes: 30 },
    { id: 'block6', name: 'Block 6 — Light Revision', type: 'study', startHour: 20, startMinute: 20, durationMinutes: 120, topic: 'Flashcards / wind-down', description: 'Light revision + flashcards' },
    { id: 'sleep', name: 'Sleep', type: 'sleep', startHour: 22, startMinute: 20, durationMinutes: 420 },
  ]
}

// DSA questions for each day
const QUESTIONS: Record<number, DSAQuestion[]> = {
  1: [
    { id: 'd1q1', title: 'Count Digits', difficulty: 'Easy', topic: 'Maths', starterCode: 'int countDigits(int n) {\n    // your code here\n}', testCases: [{ input: 'n=329283', expected: '6' }] },
    { id: 'd1q2', title: 'Reverse a Number', difficulty: 'Easy', topic: 'Maths', starterCode: 'int reverseNumber(int n) {\n    // your code here\n}', testCases: [{ input: 'n=12345', expected: '54321' }] },
    { id: 'd1q3', title: 'GCD of Two Numbers', difficulty: 'Easy', topic: 'Maths', starterCode: 'int gcd(int a, int b) {\n    // your code here\n}', testCases: [{ input: 'a=12, b=18', expected: '6' }] },
    { id: 'd1q4', title: 'Check Prime', difficulty: 'Easy', topic: 'Maths', starterCode: 'bool isPrime(int n) {\n    // your code here\n}', testCases: [{ input: 'n=17', expected: 'true' }] },
    { id: 'd1q5', title: 'Sieve of Eratosthenes', difficulty: 'Medium', topic: 'Maths', starterCode: 'vector<int> sieve(int n) {\n    // your code here\n}', testCases: [{ input: 'n=30', expected: '[2,3,5,7,11,13,17,19,23,29]' }] },
  ],
  2: [
    { id: 'd2q1', title: 'Largest Element in Array', difficulty: 'Easy', topic: 'Arrays', starterCode: 'int largest(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,1,7,2,9]', expected: '9' }] },
    { id: 'd2q2', title: 'Second Largest Element', difficulty: 'Easy', topic: 'Arrays', starterCode: 'int secondLargest(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,1,7,2,9]', expected: '7' }] },
    { id: 'd2q3', title: 'Check Sorted Array', difficulty: 'Easy', topic: 'Arrays', starterCode: 'bool isSorted(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4]', expected: 'true' }] },
    { id: 'd2q4', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topic: 'Arrays', starterCode: 'int removeDuplicates(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,1,2,2,3,4]', expected: '4' }] },
    { id: 'd2q5', title: 'Left Rotate Array by K', difficulty: 'Easy', topic: 'Arrays', starterCode: 'void rotateLeft(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], k=2', expected: '[3,4,5,1,2]' }] },
  ],
  3: [
    { id: 'd3q1', title: 'Factorial (Recursive)', difficulty: 'Easy', topic: 'Recursion', starterCode: 'long long factorial(int n) {\n    // your code here\n}', testCases: [{ input: 'n=5', expected: '120' }] },
    { id: 'd3q2', title: 'Sum of N Natural Numbers', difficulty: 'Easy', topic: 'Recursion', starterCode: 'int sumN(int n) {\n    // your code here\n}', testCases: [{ input: 'n=10', expected: '55' }] },
    { id: 'd3q3', title: 'Power of 2', difficulty: 'Easy', topic: 'Recursion', starterCode: 'long long powerOf2(int n) {\n    // your code here\n}', testCases: [{ input: 'n=10', expected: '1024' }] },
    { id: 'd3q4', title: 'Print 1 to N', difficulty: 'Easy', topic: 'Recursion', starterCode: 'void print1toN(int n) {\n    // your code here\n}', testCases: [{ input: 'n=5', expected: '1 2 3 4 5' }] },
    { id: 'd3q5', title: 'Fibonacci Number', difficulty: 'Easy', topic: 'Recursion', starterCode: 'int fib(int n) {\n    // your code here\n}', testCases: [{ input: 'n=10', expected: '55' }] },
  ],
  4: [
    { id: 'd4q1', title: 'Reverse Stack Using Recursion', difficulty: 'Medium', topic: 'Recursion', starterCode: 'void reverseStack(stack<int>& st) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4]', expected: '[4,3,2,1]' }] },
    { id: 'd4q2', title: 'Sort an Array (Recursive)', difficulty: 'Medium', topic: 'Recursion', starterCode: 'void sortArray(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
    { id: 'd4q3', title: 'Power Set / Subsequences', difficulty: 'Medium', topic: 'Recursion', starterCode: 'vector<string> subsequences(string s) {\n    // your code here\n}', testCases: [{ input: '"abc"', expected: '8 subsequences' }] },
    { id: 'd4q4', title: 'Count Good Numbers', difficulty: 'Medium', topic: 'Recursion', starterCode: 'int countGoodNumbers(long long n) {\n    // your code here\n}', testCases: [{ input: 'n=4', expected: '6' }] },
    { id: 'd4q5', title: 'Tower of Hanoi', difficulty: 'Medium', topic: 'Recursion', starterCode: 'void towerOfHanoi(int n, char from, char to, char aux) {\n    // your code here\n}', testCases: [{ input: 'n=3', expected: '7 moves' }] },
  ],
  5: [
    { id: 'd5q1', title: 'Bubble Sort', difficulty: 'Easy', topic: 'Sorting', starterCode: 'void bubbleSort(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
    { id: 'd5q2', title: 'Selection Sort', difficulty: 'Easy', topic: 'Sorting', starterCode: 'void selectionSort(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
    { id: 'd5q3', title: 'Insertion Sort', difficulty: 'Easy', topic: 'Sorting', starterCode: 'void insertionSort(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
    { id: 'd5q4', title: 'Merge Sort', difficulty: 'Medium', topic: 'Sorting', starterCode: 'void mergeSort(vector<int>& arr, int l, int r) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
    { id: 'd5q5', title: 'Quick Sort', difficulty: 'Medium', topic: 'Sorting', starterCode: 'void quickSort(vector<int>& arr, int low, int high) {\n    // your code here\n}', testCases: [{ input: '[5,2,8,1,9]', expected: '[1,2,5,8,9]' }] },
  ],
  6: [
    { id: 'd6q1', title: 'Merge Two Sorted Arrays', difficulty: 'Easy', topic: 'Sorting', starterCode: 'vector<int> mergeSorted(vector<int>& a, vector<int>& b) {\n    // your code here\n}', testCases: [{ input: '[1,3,5], [2,4,6]', expected: '[1,2,3,4,5,6]' }] },
    { id: 'd6q2', title: 'Sort 0s 1s 2s (Dutch Flag)', difficulty: 'Medium', topic: 'Sorting', starterCode: 'void sortColors(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[2,0,1,0,2,1]', expected: '[0,0,1,1,2,2]' }] },
    { id: 'd6q3', title: 'Find Pivot in Sorted Rotated Array', difficulty: 'Medium', topic: 'Sorting', starterCode: 'int findPivot(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[4,5,6,7,0,1,2]', expected: '4' }] },
    { id: 'd6q4', title: 'Kth Largest Element', difficulty: 'Medium', topic: 'Sorting', starterCode: 'int findKthLargest(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[3,2,1,5,6,4], k=2', expected: '5' }] },
    { id: 'd6q5', title: 'Missing Number', difficulty: 'Easy', topic: 'Sorting', starterCode: 'int missingNumber(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,0,1]', expected: '2' }] },
  ],
  7: [
    { id: 'd7q1', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Hashing', starterCode: 'bool isAnagram(string s, string t) {\n    // your code here\n}', testCases: [{ input: '"listen", "silent"', expected: 'true' }] },
    { id: 'd7q2', title: 'Frequency of Characters', difficulty: 'Easy', topic: 'Hashing', starterCode: 'vector<int> freq(string s) {\n    // your code here\n}', testCases: [{ input: '"aabbbcc"', expected: 'a:2, b:3, c:2' }] },
    { id: 'd7q3', title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Strings', starterCode: 'bool isPalindrome(string s) {\n    // your code here\n}', testCases: [{ input: '"A man a plan a canal Panama"', expected: 'true' }] },
    { id: 'd7q4', title: 'Longest Common Prefix', difficulty: 'Easy', topic: 'Strings', starterCode: 'string longestCommonPrefix(vector<string>& strs) {\n    // your code here\n}', testCases: [{ input: '["flower","flow","flight"]', expected: '"fl"' }] },
    { id: 'd7q5', title: 'Roman to Integer', difficulty: 'Easy', topic: 'Strings', starterCode: 'int romanToInt(string s) {\n    // your code here\n}', testCases: [{ input: '"MCMXCIV"', expected: '1994' }] },
  ],
  8: [
    { id: 'd8q1', title: 'Linear Search', difficulty: 'Easy', topic: 'Arrays', starterCode: 'int linearSearch(vector<int>& arr, int x) {\n    // your code here\n}', testCases: [{ input: '[1,3,5,7,9], x=5', expected: '2' }] },
    { id: 'd8q2', title: 'Find Missing and Repeating', difficulty: 'Medium', topic: 'Arrays', starterCode: 'vector<int> findMissingRepeating(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,3,3,4]', expected: '[3,2]' }] },
    { id: 'd8q3', title: 'Rotate Array Right by K', difficulty: 'Easy', topic: 'Arrays', starterCode: 'void rotateRight(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], k=2', expected: '[4,5,1,2,3]' }] },
    { id: 'd8q4', title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Matrix', starterCode: 'void setZeroes(vector<vector<int>>& matrix) {\n    // your code here\n}', testCases: [{ input: '[[1,0],[2,3]]', expected: '[[0,0],[2,0]]' }] },
    { id: 'd8q5', title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Matrix', starterCode: 'vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    // your code here\n}', testCases: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '[1,2,3,6,9,8,7,4,5]' }] },
  ],
  9: [
    { id: 'd9q1', title: 'Search in 2D Matrix', difficulty: 'Medium', topic: 'Matrix', starterCode: 'bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    // your code here\n}', testCases: [{ input: '[[1,3,5],[7,9,11]], target=9', expected: 'true' }] },
    { id: 'd9q2', title: 'Transpose Matrix', difficulty: 'Easy', topic: 'Matrix', starterCode: 'vector<vector<int>> transpose(vector<vector<int>>& matrix) {\n    // your code here\n}', testCases: [{ input: '[[1,2],[3,4]]', expected: '[[1,3],[2,4]]' }] },
    { id: 'd9q3', title: 'Rotate Image 90 degrees', difficulty: 'Medium', topic: 'Matrix', starterCode: 'void rotate(vector<vector<int>>& matrix) {\n    // your code here\n}', testCases: [{ input: '[[1,2],[3,4]]', expected: '[[3,1],[4,2]]' }] },
    { id: 'd9q4', title: 'Pascal Triangle', difficulty: 'Easy', topic: 'Arrays', starterCode: 'vector<vector<int>> generate(int numRows) {\n    // your code here\n}', testCases: [{ input: 'numRows=5', expected: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' }] },
    { id: 'd9q5', title: 'Majority Element', difficulty: 'Easy', topic: 'Arrays', starterCode: 'int majorityElement(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,3,3,1,2]', expected: '3' }] },
  ],
  10: [
    { id: 'd10q1', title: 'Two Sum', difficulty: 'Easy', topic: 'Two Pointers', starterCode: 'vector<int> twoSum(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[2,7,11,15], target=9', expected: '[0,1]' }] },
    { id: 'd10q2', title: 'Three Sum', difficulty: 'Medium', topic: 'Two Pointers', starterCode: 'vector<vector<int>> threeSum(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]' }] },
    { id: 'd10q3', title: 'Four Sum', difficulty: 'Medium', topic: 'Two Pointers', starterCode: 'vector<vector<int>> fourSum(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[1,0,-1,0,-2,2], target=0', expected: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' }] },
    { id: 'd10q4', title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', starterCode: 'int maxArea(vector<int>& height) {\n    // your code here\n}', testCases: [{ input: '[1,8,6,2,5,4,8,3,7]', expected: '49' }] },
    { id: 'd10q5', title: 'Remove Duplicates (in-place)', difficulty: 'Easy', topic: 'Two Pointers', starterCode: 'int removeDuplicates(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[0,0,1,1,1,2,2]', expected: '3' }] },
  ],
  11: [
    { id: 'd11q1', title: '3Sum Closest', difficulty: 'Medium', topic: 'Two Pointers', starterCode: 'int threeSumClosest(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[-1,2,1,-4], target=1', expected: '2' }] },
    { id: 'd11q2', title: 'Sort Colors (Dutch Flag)', difficulty: 'Medium', topic: 'Two Pointers', starterCode: 'void sortColors(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[2,0,1]', expected: '[0,1,2]' }] },
    { id: 'd11q3', title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Arrays', starterCode: 'int longestConsecutive(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[100,4,200,1,3,2]', expected: '4' }] },
    { id: 'd11q4', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', starterCode: 'int trap(vector<int>& height) {\n    // your code here\n}', testCases: [{ input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' }] },
    { id: 'd11q5', title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', starterCode: 'void nextPermutation(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,2,3]', expected: '[1,3,2]' }] },
  ],
  12: [
    { id: 'd12q1', title: 'Subarray Sum Equals K (Prefix Sum)', difficulty: 'Medium', topic: 'Hashing', starterCode: 'int subarraySum(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,1,1], k=2', expected: '2' }] },
    { id: 'd12q2', title: 'Longest Subarray with Sum K', difficulty: 'Medium', topic: 'Hashing', starterCode: 'int longestSubarraySum(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,1,1,1], k=3', expected: '3' }] },
    { id: 'd12q3', title: 'Binary Search — Search X', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int search(vector<int>& arr, int x) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], x=3', expected: '2' }] },
    { id: 'd12q4', title: 'Lower Bound', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int lowerBound(vector<int>& arr, int x) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,3,5], x=3', expected: '2' }] },
    { id: 'd12q5', title: 'Upper Bound', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int upperBound(vector<int>& arr, int x) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,3,5], x=3', expected: '4' }] },
  ],
  13: [
    { id: 'd13q1', title: 'Search Insert Position', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int searchInsert(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[1,3,5,6], target=5', expected: '2' }] },
    { id: 'd13q2', title: 'Find First and Last Position', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'vector<int> searchRange(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[5,7,7,8,8,10], target=8', expected: '[3,4]' }] },
    { id: 'd13q3', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int search(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[4,5,6,7,0,1,2], target=0', expected: '4' }] },
    { id: 'd13q4', title: 'Find Peak Element', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int findPeakElement(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,1]', expected: '2' }] },
    { id: 'd13q5', title: 'Sqrt(x)', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int mySqrt(int x) {\n    // your code here\n}', testCases: [{ input: 'x=8', expected: '2' }] },
  ],
  14: [
    { id: 'd14q1', title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int minEatingSpeed(vector<int>& piles, int h) {\n    // your code here\n}', testCases: [{ input: '[3,6,7,11], h=8', expected: '4' }] },
    { id: 'd14q2', title: 'Aggressive Cows', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int aggressiveCows(vector<int>& stalls, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,4,8,9], k=3', expected: '3' }] },
    { id: 'd14q3', title: 'Book Allocation', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int bookAllocation(vector<int>& books, int m) {\n    // your code here\n}', testCases: [{ input: '[12,34,67,90], m=2', expected: '113' }] },
    { id: 'd14q4', title: 'Split Array Largest Sum', difficulty: 'Hard', topic: 'Binary Search', starterCode: 'int splitArray(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[7,2,5,10,8], k=2', expected: '18' }] },
    { id: 'd14q5', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', starterCode: 'double findMedianSortedArrays(vector<int>& a, vector<int>& b) {\n    // your code here\n}', testCases: [{ input: '[1,3], [2]', expected: '2.0' }] },
  ],
  15: [
    { id: 'd15q1', title: 'Find Minimum in Rotated Array', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int findMin(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,4,5,1,2]', expected: '1' }] },
    { id: 'd15q2', title: 'Single Element in Sorted Array', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int singleNonDuplicate(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,1,2,3,3,4,4]', expected: '2' }] },
    { id: 'd15q3', title: 'Capacity To Ship Packages', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'int shipWithinDays(vector<int>& weights, int days) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5,6,7,8,9,10], days=5', expected: '15' }] },
    { id: 'd15q4', title: 'Kth Missing Positive Number', difficulty: 'Easy', topic: 'Binary Search', starterCode: 'int findKthPositive(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[2,3,4,7,11], k=5', expected: '9' }] },
    { id: 'd15q5', title: 'Search in Rotated Array II (duplicates)', difficulty: 'Medium', topic: 'Binary Search', starterCode: 'bool search(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[2,5,6,0,0,1,2], target=0', expected: 'true' }] },
  ],
  16: [
    { id: 'd16q1', title: 'Subsets I', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<int>> subsets(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,2,3]', expected: '8 subsets' }] },
    { id: 'd16q2', title: 'Subsets II (with duplicates)', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<int>> subsetsWithDup(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,2,2]', expected: '6 subsets' }] },
    { id: 'd16q3', title: 'Combination Sum I', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<int>> combinationSum(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[2,3,6,7], target=7', expected: '[[2,2,3],[7]]' }] },
    { id: 'd16q4', title: 'Combination Sum II', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<int>> combinationSum2(vector<int>& arr, int target) {\n    // your code here\n}', testCases: [{ input: '[10,1,2,7,6,1,5], target=8', expected: '[[1,1,6],[1,2,5],[1,7],[2,6]]' }] },
    { id: 'd16q5', title: 'Letter Combinations of Phone Number', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<string> letterCombinations(string digits) {\n    // your code here\n}', testCases: [{ input: '"23"', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }] },
  ],
  17: [
    { id: 'd17q1', title: 'Combination Sum III', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<int>> combinationSum3(int k, int n) {\n    // your code here\n}', testCases: [{ input: 'k=3, n=7', expected: '[[1,2,4]]' }] },
    { id: 'd17q2', title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'vector<vector<string>> partition(string s) {\n    // your code here\n}', testCases: [{ input: '"aab"', expected: '[["a","a","b"],["aa","b"]]' }] },
    { id: 'd17q3', title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', starterCode: 'bool exist(vector<vector<char>>& board, string word) {\n    // your code here\n}', testCases: [{ input: 'board=[["ABCE","SFCS","ADEE"]], word="ABCCED"', expected: 'true' }] },
    { id: 'd17q4', title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', starterCode: 'vector<vector<string>> solveNQueens(int n) {\n    // your code here\n}', testCases: [{ input: 'n=4', expected: '2 solutions' }] },
    { id: 'd17q5', title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', starterCode: 'void solveSudoku(vector<vector<char>>& board) {\n    // your code here\n}', testCases: [{ input: 'partially filled board', expected: 'solved board' }] },
  ],
  18: [
    { id: 'd18q1', title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', starterCode: 'ListNode* reverseList(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' }] },
    { id: 'd18q2', title: 'Middle of Linked List', difficulty: 'Easy', topic: 'Linked List', starterCode: 'ListNode* middleNode(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5]', expected: '[3,4,5]' }] },
    { id: 'd18q3', title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', starterCode: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    // your code here\n}', testCases: [{ input: '[1,2,4], [1,3,4]', expected: '[1,1,2,3,4,4]' }] },
    { id: 'd18q4', title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* removeNthFromEnd(ListNode* head, int n) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], n=2', expected: '[1,2,3,5]' }] },
    { id: 'd18q5', title: 'Delete Node in Doubly Linked List', difficulty: 'Easy', topic: 'Linked List', starterCode: 'void deleteNode(DLLNode* head, DLLNode* node) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4], node=3', expected: '[1,2,4]' }] },
  ],
  19: [
    { id: 'd19q1', title: 'Add Two Numbers (LL)', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // your code here\n}', testCases: [{ input: '[2,4,3], [5,6,4]', expected: '[7,0,8]' }] },
    { id: 'd19q2', title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked List', starterCode: 'bool hasCycle(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[3,2,0,-4] with cycle at pos 1', expected: 'true' }] },
    { id: 'd19q3', title: 'Find Start of Cycle', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* detectCycle(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[3,2,0,-4] with cycle at pos 1', expected: 'node at index 1' }] },
    { id: 'd19q4', title: 'Palindrome Linked List', difficulty: 'Medium', topic: 'Linked List', starterCode: 'bool isPalindrome(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,2,2,1]', expected: 'true' }] },
    { id: 'd19q5', title: 'Intersection of Two Linked Lists', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {\n    // your code here\n}', testCases: [{ input: 'intersecting lists', expected: 'intersection node' }] },
  ],
  20: [
    { id: 'd20q1', title: 'Reverse in Groups of K', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* reverseKGroup(ListNode* head, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], k=2', expected: '[2,1,4,3,5]' }] },
    { id: 'd20q2', title: 'Detect Cycle + Remove', difficulty: 'Medium', topic: 'Linked List', starterCode: 'void removeCycle(ListNode* head) {\n    // your code here\n}', testCases: [{ input: 'list with cycle', expected: 'list without cycle' }] },
    { id: 'd20q3', title: 'Flatten a Multilevel DLL', difficulty: 'Medium', topic: 'Linked List', starterCode: 'Node* flatten(Node* head) {\n    // your code here\n}', testCases: [{ input: 'multilevel list', expected: 'flattened list' }] },
    { id: 'd20q4', title: 'Clone Linked List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', starterCode: 'Node* copyRandomList(Node* head) {\n    // your code here\n}', testCases: [{ input: '[[7,null],[13,0],[11,4],[10,2],[1,0]]', expected: 'deep copy' }] },
    { id: 'd20q5', title: 'Rotate List Right by K', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* rotateRight(ListNode* head, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], k=2', expected: '[4,5,1,2,3]' }] },
  ],
  21: [
    { id: 'd21q1', title: 'Sort Linked List (Merge Sort)', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* sortList(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[4,2,1,3]', expected: '[1,2,3,4]' }] },
    { id: 'd21q2', title: 'Partition List', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* partition(ListNode* head, int x) {\n    // your code here\n}', testCases: [{ input: '[1,4,3,2,5,2], x=3', expected: '[1,2,2,4,3,5]' }] },
    { id: 'd21q3', title: 'Odd Even Linked List', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* oddEvenList(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5]', expected: '[1,3,5,2,4]' }] },
    { id: 'd21q4', title: 'Remove Duplicates from Sorted List II', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* deleteDuplicates(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,1,2,3,3,4]', expected: '[2,4]' }] },
    { id: 'd21q5', title: 'Swap Nodes in Pairs', difficulty: 'Medium', topic: 'Linked List', starterCode: 'ListNode* swapPairs(ListNode* head) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4]', expected: '[2,1,4,3]' }] },
  ],
  22: [
    { id: 'd22q1', title: 'Reverse Nodes in K Group (Hard)', difficulty: 'Hard', topic: 'Linked List', starterCode: 'ListNode* reverseKGroupHard(ListNode* head, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5], k=3', expected: '[3,2,1,4,5]' }] },
    { id: 'd22q2', title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Linked List', starterCode: 'ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // your code here\n}', testCases: [{ input: '[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]' }] },
    { id: 'd22q3', title: 'LRU Cache (using LL)', difficulty: 'Hard', topic: 'Linked List', starterCode: 'class LRUCache {\n    // your code here\n}', testCases: [{ input: 'operations', expected: 'correct values' }] },
    { id: 'd22q4', title: 'Copy List with Random Pointer', difficulty: 'Hard', topic: 'Linked List', starterCode: 'Node* copyRandomList(Node* head) {\n    // your code here\n}', testCases: [{ input: '[[7,null],[13,0]]', expected: 'deep copy' }] },
    { id: 'd22q5', title: 'All Nodes Distance K in Binary Tree', difficulty: 'Hard', topic: 'Linked List', starterCode: 'vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {\n    // your code here\n}', testCases: [{ input: 'tree, target=5, k=2', expected: '[7,4,1]' }] },
  ],
  23: [
    { id: 'd23q1', title: 'Single Number (XOR)', difficulty: 'Easy', topic: 'Bit Manipulation', starterCode: 'int singleNumber(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[2,2,1]', expected: '1' }] },
    { id: 'd23q2', title: 'Number of 1 Bits', difficulty: 'Easy', topic: 'Bit Manipulation', starterCode: 'int hammingWeight(uint32_t n) {\n    // your code here\n}', testCases: [{ input: 'n=11', expected: '3' }] },
    { id: 'd23q3', title: 'Counting Bits', difficulty: 'Easy', topic: 'Bit Manipulation', starterCode: 'vector<int> countBits(int n) {\n    // your code here\n}', testCases: [{ input: 'n=5', expected: '[0,1,1,2,1,2]' }] },
    { id: 'd23q4', title: 'Missing Number (XOR)', difficulty: 'Easy', topic: 'Bit Manipulation', starterCode: 'int missingNumber(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,0,1]', expected: '2' }] },
    { id: 'd23q5', title: 'Power of Two', difficulty: 'Easy', topic: 'Bit Manipulation', starterCode: 'bool isPowerOfTwo(int n) {\n    // your code here\n}', testCases: [{ input: 'n=16', expected: 'true' }] },
  ],
  24: [
    { id: 'd24q1', title: 'Activity Selection (Greedy)', difficulty: 'Medium', topic: 'Greedy', starterCode: 'int activitySelection(vector<int>& start, vector<int>& end) {\n    // your code here\n}', testCases: [{ input: 'start=[1,3,0,5], end=[2,4,6,7]', expected: '3' }] },
    { id: 'd24q2', title: 'Fractional Knapsack', difficulty: 'Medium', topic: 'Greedy', starterCode: 'double fractionalKnapsack(int W, vector<int>& wt, vector<int>& val) {\n    // your code here\n}', testCases: [{ input: 'W=50, wt=[10,20,30], val=[60,100,120]', expected: '240' }] },
    { id: 'd24q3', title: 'Job Sequencing with Deadline', difficulty: 'Medium', topic: 'Greedy', starterCode: 'vector<int> jobScheduling(vector<int>& deadline, vector<int>& profit) {\n    // your code here\n}', testCases: [{ input: 'deadline=[2,1,2,1], profit=[100,19,27,25]', expected: '[2,127]' }] },
    { id: 'd24q4', title: 'Minimum Platforms', difficulty: 'Medium', topic: 'Greedy', starterCode: 'int minPlatforms(vector<int>& arr, vector<int>& dep) {\n    // your code here\n}', testCases: [{ input: 'arr=[900,940,950,1100], dep=[910,1120,1130,1200]', expected: '3' }] },
    { id: 'd24q5', title: 'Assign Cookies', difficulty: 'Easy', topic: 'Greedy', starterCode: 'int findContentChildren(vector<int>& g, vector<int>& s) {\n    // your code here\n}', testCases: [{ input: 'g=[1,2,3], s=[1,1]', expected: '1' }] },
  ],
  25: [
    { id: 'd25q1', title: 'Jump Game', difficulty: 'Medium', topic: 'Greedy', starterCode: 'bool canJump(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[2,3,1,1,4]', expected: 'true' }] },
    { id: 'd25q2', title: 'Jump Game II (Min Jumps)', difficulty: 'Medium', topic: 'Greedy', starterCode: 'int jump(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[2,3,1,1,4]', expected: '2' }] },
    { id: 'd25q3', title: 'Gas Station', difficulty: 'Medium', topic: 'Greedy', starterCode: 'int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    // your code here\n}', testCases: [{ input: 'gas=[1,2,3,4,5], cost=[3,4,5,1,2]', expected: '3' }] },
    { id: 'd25q4', title: 'Candy Distribution', difficulty: 'Hard', topic: 'Greedy', starterCode: 'int candy(vector<int>& ratings) {\n    // your code here\n}', testCases: [{ input: '[1,0,2]', expected: '5' }] },
    { id: 'd25q5', title: 'Task Scheduler', difficulty: 'Medium', topic: 'Greedy', starterCode: 'int leastInterval(vector<char>& tasks, int n) {\n    // your code here\n}', testCases: [{ input: '["A","A","A","B","B","B"], n=2', expected: '8' }] },
  ],
  26: [
    { id: 'd26q1', title: 'Max Sum Subarray of Size K', difficulty: 'Easy', topic: 'Sliding Window', starterCode: 'int maxSumSubarray(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[2,1,5,1,3,2], k=3', expected: '9' }] },
    { id: 'd26q2', title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int lengthOfLongestSubstring(string s) {\n    // your code here\n}', testCases: [{ input: '"abcabcbb"', expected: '3' }] },
    { id: 'd26q3', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int characterReplacement(string s, int k) {\n    // your code here\n}', testCases: [{ input: '"ABAB", k=2', expected: '4' }] },
    { id: 'd26q4', title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', starterCode: 'string minWindow(string s, string t) {\n    // your code here\n}', testCases: [{ input: 's="ADOBECODEBANC", t="ABC"', expected: '"BANC"' }] },
    { id: 'd26q5', title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Sliding Window', starterCode: 'vector<int> maxSlidingWindow(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,3,-1,-3,5,3,6,7], k=3', expected: '[3,3,5,5,6,7]' }] },
  ],
  27: [
    { id: 'd27q1', title: 'Fruit Into Baskets', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int totalFruit(vector<int>& fruits) {\n    // your code here\n}', testCases: [{ input: '[1,2,1]', expected: '3' }] },
    { id: 'd27q2', title: 'Permutation in String', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'bool checkInclusion(string s1, string s2) {\n    // your code here\n}', testCases: [{ input: 's1="ab", s2="eidbaooo"', expected: 'true' }] },
    { id: 'd27q3', title: 'Longest Subarray of 1s After Deleting One', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int longestSubarray(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,1,0,1]', expected: '3' }] },
    { id: 'd27q4', title: 'Max Consecutive Ones III', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int longestOnes(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,1,1,0,0,0,1,1,1,1,0], k=2', expected: '6' }] },
    { id: 'd27q5', title: 'Count Number of Nice Subarrays', difficulty: 'Medium', topic: 'Sliding Window', starterCode: 'int numberOfSubarrays(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,1,2,1,1], k=3', expected: '2' }] },
  ],
  28: [
    { id: 'd28q1', title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', starterCode: 'bool isValid(string s) {\n    // your code here\n}', testCases: [{ input: '"()[]{}"', expected: 'true' }] },
    { id: 'd28q2', title: 'Implement Stack using Array', difficulty: 'Easy', topic: 'Stack', starterCode: 'class Stack {\n    // your code here\n}', testCases: [{ input: 'push/pop operations', expected: 'LIFO behavior' }] },
    { id: 'd28q3', title: 'Implement Queue using Stack', difficulty: 'Easy', topic: 'Queue', starterCode: 'class MyQueue {\n    // your code here\n}', testCases: [{ input: 'push/pop operations', expected: 'FIFO behavior' }] },
    { id: 'd28q4', title: 'Min Stack', difficulty: 'Medium', topic: 'Stack', starterCode: 'class MinStack {\n    // your code here\n}', testCases: [{ input: 'push(-2),push(0),push(-3),getMin', expected: '-3' }] },
    { id: 'd28q5', title: 'Next Greater Element', difficulty: 'Medium', topic: 'Stack', starterCode: 'vector<int> nextGreaterElement(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[4,5,2,10,8]', expected: '[5,10,10,-1,-1]' }] },
  ],
  29: [
    { id: 'd29q1', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Stack', starterCode: 'int largestRectangleArea(vector<int>& heights) {\n    // your code here\n}', testCases: [{ input: '[2,1,5,6,2,3]', expected: '10' }] },
    { id: 'd29q2', title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Stack', starterCode: 'vector<int> dailyTemperatures(vector<int>& temps) {\n    // your code here\n}', testCases: [{ input: '[73,74,75,71,69,72,76,73]', expected: '[1,1,4,2,1,1,0,0]' }] },
    { id: 'd29q3', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topic: 'Stack', starterCode: 'int evalRPN(vector<string>& tokens) {\n    // your code here\n}', testCases: [{ input: '["2","1","+","3","*"]', expected: '9' }] },
    { id: 'd29q4', title: 'Asteroid Collision', difficulty: 'Medium', topic: 'Stack', starterCode: 'vector<int> asteroidCollision(vector<int>& asteroids) {\n    // your code here\n}', testCases: [{ input: '[5,10,-5]', expected: '[5,10]' }] },
    { id: 'd29q5', title: 'Online Stock Span', difficulty: 'Medium', topic: 'Stack', starterCode: 'class StockSpanner {\n    // your code here\n}', testCases: [{ input: '[100,80,60,70,60,75,85]', expected: '[1,1,1,2,1,4,6]' }] },
  ],
  30: [
    { id: 'd30q1', title: 'Sliding Window Maximum (Deque)', difficulty: 'Hard', topic: 'Stack/Queue', starterCode: 'vector<int> maxSlidingWindow(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,3,-1,-3,5,3,6,7], k=3', expected: '[3,3,5,5,6,7]' }] },
    { id: 'd30q2', title: 'LRU Cache (Design)', difficulty: 'Medium', topic: 'Stack/Queue', starterCode: 'class LRUCache {\n    // your code here\n}', testCases: [{ input: 'put(1,1),put(2,2),get(1),put(3,3),get(2)', expected: '[1,-1]' }] },
    { id: 'd30q3', title: 'LFU Cache (Design)', difficulty: 'Hard', topic: 'Stack/Queue', starterCode: 'class LFUCache {\n    // your code here\n}', testCases: [{ input: 'operations', expected: 'correct values' }] },
    { id: 'd30q4', title: 'First Non-Repeating in Stream', difficulty: 'Medium', topic: 'Queue', starterCode: 'string firstNonRepeating(string s) {\n    // your code here\n}', testCases: [{ input: '"aabcb"', expected: 'a#b#b' }] },
    { id: 'd30q5', title: 'Circular Queue Design', difficulty: 'Medium', topic: 'Queue', starterCode: 'class MyCircularQueue {\n    // your code here\n}', testCases: [{ input: 'enQueue/deQueue operations', expected: 'correct values' }] },
  ],
  31: [
    { id: 'd31q1', title: 'Inorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'vector<int> inorderTraversal(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,null,2,3]', expected: '[1,3,2]' }] },
    { id: 'd31q2', title: 'Preorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'vector<int> preorderTraversal(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,null,2,3]', expected: '[1,2,3]' }] },
    { id: 'd31q3', title: 'Postorder Traversal', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'vector<int> postorderTraversal(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,null,2,3]', expected: '[3,2,1]' }] },
    { id: 'd31q4', title: 'Level Order Traversal', difficulty: 'Medium', topic: 'Binary Tree', starterCode: 'vector<vector<int>> levelOrder(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[3,9,20,null,null,15,7]', expected: '[[3],[9,20],[15,7]]' }] },
    { id: 'd31q5', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'int maxDepth(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[3,9,20,null,null,15,7]', expected: '3' }] },
  ],
  32: [
    { id: 'd32q1', title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'int diameterOfBinaryTree(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,4,5]', expected: '3' }] },
    { id: 'd32q2', title: 'Balanced Binary Tree', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'bool isBalanced(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[3,9,20,null,null,15,7]', expected: 'true' }] },
    { id: 'd32q3', title: 'Same Tree', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'bool isSameTree(TreeNode* p, TreeNode* q) {\n    // your code here\n}', testCases: [{ input: '[1,2,3], [1,2,3]', expected: 'true' }] },
    { id: 'd32q4', title: 'Symmetric Tree', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'bool isSymmetric(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,2,2,3,4,4,3]', expected: 'true' }] },
    { id: 'd32q5', title: 'Path Sum', difficulty: 'Easy', topic: 'Binary Tree', starterCode: 'bool hasPathSum(TreeNode* root, int targetSum) {\n    // your code here\n}', testCases: [{ input: '[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22', expected: 'true' }] },
  ],
  33: [
    { id: 'd33q1', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Binary Tree', starterCode: 'int maxPathSum(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[-10,9,20,null,null,15,7]', expected: '42' }] },
    { id: 'd33q2', title: 'Construct from Preorder + Inorder', difficulty: 'Medium', topic: 'Binary Tree', starterCode: 'TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n    // your code here\n}', testCases: [{ input: 'preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]', expected: 'tree' }] },
    { id: 'd33q3', title: 'Morris Inorder Traversal', difficulty: 'Medium', topic: 'Binary Tree', starterCode: 'vector<int> morrisInorder(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,null,2,3]', expected: '[1,3,2]' }] },
    { id: 'd33q4', title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'Binary Tree', starterCode: 'void flatten(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[1,2,5,3,4,null,6]', expected: 'right-skewed list' }] },
    { id: 'd33q5', title: 'Lowest Common Ancestor', difficulty: 'Medium', topic: 'Binary Tree', starterCode: 'TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    // your code here\n}', testCases: [{ input: '[3,5,1,6,2,0,8,null,null,7,4]', expected: '3' }] },
  ],
  34: [
    { id: 'd34q1', title: 'Validate BST', difficulty: 'Medium', topic: 'BST', starterCode: 'bool isValidBST(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[2,1,3]', expected: 'true' }] },
    { id: 'd34q2', title: 'Search in BST', difficulty: 'Easy', topic: 'BST', starterCode: 'TreeNode* searchBST(TreeNode* root, int val) {\n    // your code here\n}', testCases: [{ input: '[4,2,7,1,3], val=2', expected: 'node with val=2' }] },
    { id: 'd34q3', title: 'Insert into BST', difficulty: 'Medium', topic: 'BST', starterCode: 'TreeNode* insertIntoBST(TreeNode* root, int val) {\n    // your code here\n}', testCases: [{ input: '[4,2,7,1,3], val=5', expected: 'updated tree' }] },
    { id: 'd34q4', title: 'Kth Smallest in BST', difficulty: 'Medium', topic: 'BST', starterCode: 'int kthSmallest(TreeNode* root, int k) {\n    // your code here\n}', testCases: [{ input: '[3,1,4,null,2], k=1', expected: '1' }] },
    { id: 'd34q5', title: 'LCA of BST', difficulty: 'Easy', topic: 'BST', starterCode: 'TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    // your code here\n}', testCases: [{ input: '[6,2,8,0,4,7,9], p=2, q=8', expected: '6' }] },
  ],
  35: [
    { id: 'd35q1', title: 'Floor in BST', difficulty: 'Easy', topic: 'BST', starterCode: 'int floorInBST(TreeNode* root, int key) {\n    // your code here\n}', testCases: [{ input: '[10,5,15,2,6], key=7', expected: '6' }] },
    { id: 'd35q2', title: 'Ceil in BST', difficulty: 'Easy', topic: 'BST', starterCode: 'int ceilInBST(TreeNode* root, int key) {\n    // your code here\n}', testCases: [{ input: '[10,5,15,2,6], key=7', expected: '10' }] },
    { id: 'd35q3', title: 'Two Sum in BST', difficulty: 'Medium', topic: 'BST', starterCode: 'bool findTarget(TreeNode* root, int k) {\n    // your code here\n}', testCases: [{ input: '[5,3,6,2,4,null,7], k=9', expected: 'true' }] },
    { id: 'd35q4', title: 'Construct BST from Preorder', difficulty: 'Medium', topic: 'BST', starterCode: 'TreeNode* bstFromPreorder(vector<int>& preorder) {\n    // your code here\n}', testCases: [{ input: '[8,5,1,7,10,12]', expected: 'BST' }] },
    { id: 'd35q5', title: 'Serialize and Deserialize BST', difficulty: 'Hard', topic: 'BST', starterCode: 'string serialize(TreeNode* root) {\n    // your code here\n}', testCases: [{ input: '[2,1,3]', expected: 'serialized + deserialized' }] },
  ],
  36: [
    { id: 'd36q1', title: 'Kth Largest Element in Stream', difficulty: 'Easy', topic: 'Heaps', starterCode: 'class KthLargest {\n    // your code here\n}', testCases: [{ input: 'k=3, [4,5,8,2], add(3),add(5)', expected: '[4,5,5]' }] },
    { id: 'd36q2', title: 'Kth Largest in Array', difficulty: 'Medium', topic: 'Heaps', starterCode: 'int findKthLargest(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[3,2,1,5,6,4], k=2', expected: '5' }] },
    { id: 'd36q3', title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heaps', starterCode: 'vector<int> topKFrequent(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,1,1,2,2,3], k=2', expected: '[1,2]' }] },
    { id: 'd36q4', title: 'Merge K Sorted Arrays', difficulty: 'Hard', topic: 'Heaps', starterCode: 'vector<int> mergeKArrays(vector<vector<int>>& arr) {\n    // your code here\n}', testCases: [{ input: '[[1,4],[2,5],[3,6]]', expected: '[1,2,3,4,5,6]' }] },
    { id: 'd36q5', title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heaps', starterCode: 'class MedianFinder {\n    // your code here\n}', testCases: [{ input: 'addNum(1),addNum(2),findMedian', expected: '1.5' }] },
  ],
  37: [
    { id: 'd37q1', title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', topic: 'Trie', starterCode: 'class Trie {\n    // your code here\n}', testCases: [{ input: 'insert("apple"),search("apple")', expected: 'true' }] },
    { id: 'd37q2', title: 'Word Break (Trie)', difficulty: 'Medium', topic: 'Trie', starterCode: 'bool wordBreak(string s, vector<string>& dict) {\n    // your code here\n}', testCases: [{ input: 's="leetcode", dict=["leet","code"]', expected: 'true' }] },
    { id: 'd37q3', title: 'Replace Words (Trie)', difficulty: 'Medium', topic: 'Trie', starterCode: 'string replaceWords(vector<string>& dict, string sentence) {\n    // your code here\n}', testCases: [{ input: 'dict=["cat","bat"], sentence="the cattle"', expected: '"the cat"' }] },
    { id: 'd37q4', title: 'Longest Word in Dictionary', difficulty: 'Easy', topic: 'Trie', starterCode: 'string longestWord(vector<string>& words) {\n    // your code here\n}', testCases: [{ input: '["w","wo","wor","worl","world"]', expected: '"world"' }] },
    { id: 'd37q5', title: 'Design Add and Search Words', difficulty: 'Medium', topic: 'Trie', starterCode: 'class WordDictionary {\n    // your code here\n}', testCases: [{ input: 'addWord("bad"),search(".ad")', expected: 'true' }] },
  ],
  38: [
    { id: 'd38q1', title: 'BFS of Graph', difficulty: 'Easy', topic: 'Graph', starterCode: 'vector<int> bfsOfGraph(int V, vector<int> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=5, adj=[[1,2,3],[0],[0],[0],[2,3]]', expected: '[0,1,2,3,4]' }] },
    { id: 'd38q2', title: 'DFS of Graph', difficulty: 'Easy', topic: 'Graph', starterCode: 'vector<int> dfsOfGraph(int V, vector<int> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=5, adj=[[1,2,3],[0],[0],[0],[2,3]]', expected: '[0,1,2,3,4]' }] },
    { id: 'd38q3', title: 'Number of Connected Components', difficulty: 'Medium', topic: 'Graph', starterCode: 'int countComponents(int n, vector<vector<int>>& edges) {\n    // your code here\n}', testCases: [{ input: 'n=5, edges=[[0,1],[2,3]]', expected: '2' }] },
    { id: 'd38q4', title: 'Detect Cycle in Undirected Graph', difficulty: 'Medium', topic: 'Graph', starterCode: 'bool isCycle(int V, vector<int> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=5, adj=[[1],[0,2,4],[1,3],[2,4],[1,3]]', expected: 'true' }] },
    { id: 'd38q5', title: 'Detect Cycle in Directed Graph', difficulty: 'Medium', topic: 'Graph', starterCode: 'bool isCyclic(int V, vector<int> adj[]) {\n    // your code code here\n}', testCases: [{ input: 'V=4, adj=[[1],[2],[3],[1]]', expected: 'true' }] },
  ],
  39: [
    { id: 'd39q1', title: 'Topological Sort (BFS/Kahn)', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<int> topoSort(int V, vector<int> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=4, adj=[[],[0],[0,1],[0,2]]', expected: '[3,2,1,0]' }] },
    { id: 'd39q2', title: 'Course Schedule I', difficulty: 'Medium', topic: 'Graph', starterCode: 'bool canFinish(int n, vector<vector<int>>& pre) {\n    // your code here\n}', testCases: [{ input: 'n=2, pre=[[1,0]]', expected: 'true' }] },
    { id: 'd39q3', title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<int> findOrder(int n, vector<vector<int>>& pre) {\n    // your code here\n}', testCases: [{ input: 'n=4, pre=[[1,0],[2,0],[3,1],[3,2]]', expected: '[0,1,2,3]' }] },
    { id: 'd39q4', title: 'Bipartite Graph Check', difficulty: 'Medium', topic: 'Graph', starterCode: 'bool isBipartite(vector<vector<int>>& graph) {\n    // your code here\n}', testCases: [{ input: '[[1,3],[0,2],[1,3],[0,2]]', expected: 'true' }] },
    { id: 'd39q5', title: 'Number of Islands', difficulty: 'Medium', topic: 'Graph', starterCode: 'int numIslands(vector<vector<char>>& grid) {\n    // your code here\n}', testCases: [{ input: '[["1","1","0"],["1","0","0"],["0","0","1"]]', expected: '2' }] },
  ],
  40: [
    { id: 'd40q1', title: 'Dijkstra Algorithm', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<int> dijkstra(int V, vector<vector<int>> adj[], int S) {\n    // your code here\n}', testCases: [{ input: 'V=2, adj=[[[1,9]],[[0,9]]], S=0', expected: '[0,9]' }] },
    { id: 'd40q2', title: 'Bellman-Ford Algorithm', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<int> bellmanFord(int V, vector<vector<int>>& edges, int S) {\n    // your code here\n}', testCases: [{ input: 'V=3, edges=[[0,1,5],[1,2,-2],[0,2,6]], S=0', expected: '[0,5,3]' }] },
    { id: 'd40q3', title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graph', starterCode: 'int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n    // your code here\n}', testCases: [{ input: 'times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2', expected: '2' }] },
    { id: 'd40q4', title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Graph', starterCode: 'int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {\n    // your code here\n}', testCases: [{ input: 'n=4, flights=[[0,1,100],[1,2,100],[2,3,100],[0,2,500]], src=0, dst=3, k=1', expected: '700' }] },
    { id: 'd40q5', title: 'Floyd Warshall', difficulty: 'Hard', topic: 'Graph', starterCode: 'void floydWarshall(vector<vector<int>>& dist) {\n    // your code here\n}', testCases: [{ input: 'dist matrix', expected: 'all-pairs shortest paths' }] },
  ],
  41: [
    { id: 'd41q1', title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', topic: 'Graph', starterCode: 'int shortestPathBinaryMatrix(vector<vector<int>>& grid) {\n    // your code here\n}', testCases: [{ input: '[[0,1],[1,0]]', expected: '2' }] },
    { id: 'd41q2', title: '01 Matrix (BFS)', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {\n    // your code here\n}', testCases: [{ input: '[[0,0,0],[0,1,0],[1,1,1]]', expected: '[[0,0,0],[0,1,0],[1,2,1]]' }] },
    { id: 'd41q3', title: 'Walls and Gates (BFS)', difficulty: 'Medium', topic: 'Graph', starterCode: 'void wallsAndGates(vector<vector<int>>& rooms) {\n    // your code here\n}', testCases: [{ input: 'rooms with INF, -1, 0', expected: 'distance to nearest gate' }] },
    { id: 'd41q4', title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Graph', starterCode: 'int orangesRotting(vector<vector<int>>& grid) {\n    // your code here\n}', testCases: [{ input: '[[2,1,1],[1,1,0],[0,1,1]]', expected: '4' }] },
    { id: 'd41q5', title: 'Word Ladder', difficulty: 'Hard', topic: 'Graph', starterCode: 'int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n    // your code here\n}', testCases: [{ input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]', expected: '5' }] },
  ],
  42: [
    { id: 'd42q1', title: 'Kruskal Algorithm (MST)', difficulty: 'Medium', topic: 'Graph', starterCode: 'int kruskal(int V, vector<vector<int>> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=3, weighted graph', expected: 'MST weight' }] },
    { id: 'd42q2', title: 'Prim Algorithm (MST)', difficulty: 'Medium', topic: 'Graph', starterCode: 'int prim(int V, vector<vector<int>> adj[]) {\n    // your code here\n}', testCases: [{ input: 'V=3, weighted graph', expected: 'MST weight' }] },
    { id: 'd42q3', title: 'Disjoint Set Union (DSU)', difficulty: 'Medium', topic: 'Graph', starterCode: 'class DSU {\n    // your code here\n}', testCases: [{ input: 'union/find operations', expected: 'correct components' }] },
    { id: 'd42q4', title: 'Number of Operations to Connect', difficulty: 'Medium', topic: 'Graph', starterCode: 'int makeConnected(int n, vector<vector<int>>& connections) {\n    // your code here\n}', testCases: [{ input: 'n=4, connections=[[0,1],[0,2],[1,2]]', expected: '1' }] },
    { id: 'd42q5', title: 'Accounts Merge (DSU)', difficulty: 'Medium', topic: 'Graph', starterCode: 'vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {\n    // your code here\n}', testCases: [{ input: 'accounts with emails', expected: 'merged accounts' }] },
  ],
  43: [
    { id: 'd43q1', title: 'Climbing Stairs (DP)', difficulty: 'Easy', topic: 'DP', starterCode: 'int climbStairs(int n) {\n    // your code here\n}', testCases: [{ input: 'n=3', expected: '3' }] },
    { id: 'd43q2', title: 'Unique Paths (Grid DP)', difficulty: 'Medium', topic: 'DP', starterCode: 'int uniquePaths(int m, int n) {\n    // your code here\n}', testCases: [{ input: 'm=3, n=7', expected: '28' }] },
    { id: 'd43q3', title: 'Min Path Sum (Grid DP)', difficulty: 'Medium', topic: 'DP', starterCode: 'int minPathSum(vector<vector<int>>& grid) {\n    // your code here\n}', testCases: [{ input: '[[1,3,1],[1,5,1],[4,2,1]]', expected: '7' }] },
    { id: 'd43q4', title: 'Best Time to Buy/Sell Stock I', difficulty: 'Easy', topic: 'DP', starterCode: 'int maxProfit(vector<int>& prices) {\n    // your code here\n}', testCases: [{ input: '[7,1,5,3,6,4]', expected: '5' }] },
    { id: 'd43q5', title: 'Best Time to Buy/Sell Stock II', difficulty: 'Easy', topic: 'DP', starterCode: 'int maxProfit2(vector<int>& prices) {\n    // your code here\n}', testCases: [{ input: '[7,1,5,3,6,4]', expected: '7' }] },
  ],
  44: [
    { id: 'd44q1', title: 'Best Time Buy/Sell Stock III', difficulty: 'Hard', topic: 'DP', starterCode: 'int maxProfit3(vector<int>& prices) {\n    // your code here\n}', testCases: [{ input: '[3,3,5,0,0,3,1,4]', expected: '6' }] },
    { id: 'd44q2', title: 'Best Time Buy/Sell Stock IV', difficulty: 'Hard', topic: 'DP', starterCode: 'int maxProfit4(int k, vector<int>& prices) {\n    // your code here\n}', testCases: [{ input: 'k=2, [3,2,6,5,0,3]', expected: '7' }] },
    { id: 'd44q3', title: 'Best Time Buy/Sell with Cooldown', difficulty: 'Medium', topic: 'DP', starterCode: 'int maxProfitCooldown(vector<int>& prices) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,0,2]', expected: '3' }] },
    { id: 'd44q4', title: 'House Robber', difficulty: 'Medium', topic: 'DP', starterCode: 'int rob(vector<int>& nums) {\n    // your code here\n}', testCases: [{ input: '[1,2,3,1]', expected: '4' }] },
    { id: 'd44q5', title: 'House Robber II (Circular)', difficulty: 'Medium', topic: 'DP', starterCode: 'int rob2(vector<int>& nums) {\n    // your code here\n}', testCases: [{ input: '[2,3,2]', expected: '3' }] },
  ],
  45: [
    { id: 'd45q1', title: 'Subset Sum (DP)', difficulty: 'Medium', topic: 'DP', starterCode: 'bool subsetSum(vector<int>& arr, int sum) {\n    // your code here\n}', testCases: [{ input: '[3,34,4,12,5,2], sum=9', expected: 'true' }] },
    { id: 'd45q2', title: '0/1 Knapsack', difficulty: 'Medium', topic: 'DP', starterCode: 'int knapsack(int W, vector<int>& wt, vector<int>& val) {\n    // your code here\n}', testCases: [{ input: 'W=50, wt=[10,20,30], val=[60,100,120]', expected: '220' }] },
    { id: 'd45q3', title: 'Partition Equal Subset Sum', difficulty: 'Medium', topic: 'DP', starterCode: 'bool canPartition(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,5,11,5]', expected: 'true' }] },
    { id: 'd45q4', title: 'Count of Subsets with Sum K', difficulty: 'Medium', topic: 'DP', starterCode: 'int countSubsets(vector<int>& arr, int k) {\n    // your code here\n}', testCases: [{ input: '[1,2,2,3], k=3', expected: '3' }] },
    { id: 'd45q5', title: 'Minimum Subset Sum Difference', difficulty: 'Hard', topic: 'DP', starterCode: 'int minDifference(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,6,11,5]', expected: '1' }] },
  ],
  46: [
    { id: 'd46q1', title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', starterCode: 'int lengthOfLIS(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[10,9,2,5,3,7,101,18]', expected: '4' }] },
    { id: 'd46q2', title: 'Longest Common Subsequence', difficulty: 'Medium', topic: 'DP', starterCode: 'int longestCommonSubsequence(string s1, string s2) {\n    // your code here\n}', testCases: [{ input: '"abcde", "ace"', expected: '3' }] },
    { id: 'd46q3', title: 'Longest Common Substring', difficulty: 'Medium', topic: 'DP', starterCode: 'int longestCommonSubstring(string s1, string s2) {\n    // your code here\n}', testCases: [{ input: '"abcdxyz", "xyzabcd"', expected: '4' }] },
    { id: 'd46q4', title: 'Longest Palindromic Subsequence', difficulty: 'Medium', topic: 'DP', starterCode: 'int longestPalindromeSubseq(string s) {\n    // your code here\n}', testCases: [{ input: '"bbbab"', expected: '4' }] },
    { id: 'd46q5', title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', starterCode: 'int minDistance(string word1, string word2) {\n    // your code here\n}', testCases: [{ input: '"horse", "ros"', expected: '3' }] },
  ],
  47: [
    { id: 'd47q1', title: 'Longest String Chain', difficulty: 'Medium', topic: 'DP', starterCode: 'int longestStrChain(vector<string>& words) {\n    // your code here\n}', testCases: [{ input: '["a","b","ba","bca","bda","bdca"]', expected: '4' }] },
    { id: 'd47q2', title: 'Bitonic Subsequence', difficulty: 'Hard', topic: 'DP', starterCode: 'int longestBitonicSubsequence(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[1,11,2,10,4,5,2,1]', expected: '6' }] },
    { id: 'd47q3', title: 'Min Insertions/Deletions', difficulty: 'Medium', topic: 'DP', starterCode: 'int minOperations(string s1, string s2) {\n    // your code here\n}', testCases: [{ input: '"heap", "pea"', expected: '3' }] },
    { id: 'd47q4', title: 'Shortest Common Supersequence', difficulty: 'Hard', topic: 'DP', starterCode: 'int shortestCommonSupersequence(string s1, string s2) {\n    // your code here\n}', testCases: [{ input: '"AGGTAB", "GXTXAYB"', expected: '9' }] },
    { id: 'd47q5', title: 'Wildcard Matching', difficulty: 'Hard', topic: 'DP', starterCode: 'bool isMatch(string s, string p) {\n    // your code here\n}', testCases: [{ input: 's="aa", p="a*"', expected: 'true' }] },
  ],
  48: [
    { id: 'd48q1', title: 'MCM (Matrix Chain Multiplication)', difficulty: 'Hard', topic: 'DP', starterCode: 'int mcm(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[40,20,30,10,30]', expected: '26000' }] },
    { id: 'd48q2', title: 'Burst Balloons', difficulty: 'Hard', topic: 'DP', starterCode: 'int maxCoins(vector<int>& arr) {\n    // your code here\n}', testCases: [{ input: '[3,1,5,8]', expected: '167' }] },
    { id: 'd48q3', title: 'KMP Pattern Matching', difficulty: 'Hard', topic: 'Strings', starterCode: 'int kmp(string text, string pattern) {\n    // your code here\n}', testCases: [{ input: '"ABABDABACDABABC", "ABABC"', expected: '10' }] },
    { id: 'd48q4', title: 'Z-Function', difficulty: 'Hard', topic: 'Strings', starterCode: 'vector<int> zFunction(string s) {\n    // your code here\n}', testCases: [{ input: '"aabcaabxaaaz"', expected: '[12,1,0,0,3,1,0,0,2,2,1,0]' }] },
    { id: 'd48q5', title: 'Rabin-Karp', difficulty: 'Hard', topic: 'Strings', starterCode: 'int rabinKarp(string text, string pattern) {\n    // your code here\n}', testCases: [{ input: '"GEEKS FOR GEEKS", "GEEK"', expected: '0' }] },
  ],
  49: [
    { id: 'd49q1', title: 'Segment Tree — Range Sum', difficulty: 'Medium', topic: 'Segment Tree', starterCode: 'class SegmentTree {\n    // your code here\n}', testCases: [{ input: 'arr=[1,3,5,7,9], query(2,4)', expected: '21' }] },
    { id: 'd49q2', title: 'Segment Tree — Range Min', difficulty: 'Medium', topic: 'Segment Tree', starterCode: 'class SegmentTreeMin {\n    // your code here\n}', testCases: [{ input: 'arr=[5,2,6,3,1], query(1,3)', expected: '1' }] },
    { id: 'd49q3', title: 'Fenwick Tree (BIT)', difficulty: 'Medium', topic: 'Fenwick Tree', starterCode: 'class FenwickTree {\n    // your code here\n}', testCases: [{ input: 'arr=[2,1,1,3,2], update(3,2), query(0,4)', expected: '9' }] },
    { id: 'd49q4', title: 'Count Primes (Sieve)', difficulty: 'Easy', topic: 'Maths', starterCode: 'int countPrimes(int n) {\n    // your code here\n}', testCases: [{ input: 'n=10', expected: '4' }] },
    { id: 'd49q5', title: 'Prime Factorization', difficulty: 'Easy', topic: 'Maths', starterCode: 'vector<int> primeFactors(int n) {\n    // your code here\n}', testCases: [{ input: 'n=12', expected: '[2,2,3]' }] },
  ],
  50: [
    { id: 'd50q1', title: 'Design Parking Lot (LLD)', difficulty: 'Hard', topic: 'LLD', starterCode: '// Design Parking Lot system\n// Classes: Vehicle, ParkingSpot, ParkingFloor, ParkingLot\n// your code here' },
    { id: 'd50q2', title: 'Design Tic-Tac-Toe (LLD)', difficulty: 'Medium', topic: 'LLD', starterCode: '// Design Tic-Tac-Toe game\n// Classes: Game, Board, Player, Cell\n// your code here' },
    { id: 'd50q3', title: 'Singleton Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Singleton {\n    // your code here\n}' },
    { id: 'd50q4', title: 'Factory Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Factory {\n    // your code here\n}' },
    { id: 'd50q5', title: 'Observer Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Observer {\n    // your code here\n}' },
  ],
  51: [
    { id: 'd51q1', title: 'Design Elevator System (LLD)', difficulty: 'Hard', topic: 'LLD', starterCode: '// Design Elevator system\n// Classes: Elevator, Request, Floor, ElevatorController\n// your code here' },
    { id: 'd51q2', title: 'Strategy Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Strategy {\n    // your code here\n}' },
    { id: 'd51q3', title: 'Adapter Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Adapter {\n    // your code here\n}' },
    { id: 'd51q4', title: 'Decorator Pattern', difficulty: 'Easy', topic: 'LLD', starterCode: 'class Decorator {\n    // your code here\n}' },
    { id: 'd51q5', title: 'SOLID Principles Implementation', difficulty: 'Medium', topic: 'LLD', starterCode: '// Demonstrate SOLID principles\n// your code here' },
  ],
  52: [
    { id: 'd52q1', title: 'LRU Cache from Scratch (LLD)', difficulty: 'Hard', topic: 'LLD', starterCode: 'class LRUCache {\n    // your code here\n}', testCases: [{ input: 'put(1,1),get(1)', expected: '1' }] },
    { id: 'd52q2', title: 'Design HashMap (LLD)', difficulty: 'Medium', topic: 'LLD', starterCode: 'class MyHashMap {\n    // your code here\n}' },
    { id: 'd52q3', title: 'Design Twitter Feed (LLD)', difficulty: 'Hard', topic: 'LLD', starterCode: '// Design Twitter Feed\n// your code here' },
    { id: 'd52q4', title: 'Design Instagram Feed (LLD)', difficulty: 'Hard', topic: 'LLD', starterCode: '// Design Instagram Feed\n// your code here' },
    { id: 'd52q5', title: 'Snake and Ladder (LLD)', difficulty: 'Medium', topic: 'LLD', starterCode: '// Design Snake and Ladder game\n// your code here' },
  ],
  53: [
    { id: 'd53q1', title: 'Design URL Shortener (HLD)', difficulty: 'Hard', topic: 'HLD', starterCode: '// Design URL Shortener\n// Components: API, DB, Cache, Base62 encoding\n// your code here' },
    { id: 'd53q2', title: 'Design Instagram (HLD)', difficulty: 'Hard', topic: 'HLD', starterCode: '// Design Instagram\n// Components: API, DB, Cache, CDN, Storage\n// your code here' },
    { id: 'd53q3', title: 'Design WhatsApp (HLD)', difficulty: 'Hard', topic: 'HLD', starterCode: '// Design WhatsApp\n// Components: Chat server, DB, Push notifications\n// your code here' },
    { id: 'd53q4', title: 'Scalability Concepts', difficulty: 'Medium', topic: 'HLD', starterCode: '// Document scalability concepts\n// your code here' },
    { id: 'd53q5', title: 'CAP Theorem + Load Balancing', difficulty: 'Medium', topic: 'HLD', starterCode: '// Document CAP + Load Balancing\n// your code here' },
  ],
  54: [
    { id: 'd54q1', title: 'Timed Mock 1 (Mixed Easy)', difficulty: 'Easy', topic: 'Mock', starterCode: '// Solve within 15 minutes\n// your code here' },
    { id: 'd54q2', title: 'Timed Mock 2 (Mixed Medium)', difficulty: 'Medium', topic: 'Mock', starterCode: '// Solve within 25 minutes\n// your code here' },
    { id: 'd54q3', title: 'Timed Mock 3 (Mixed Hard)', difficulty: 'Hard', topic: 'Mock', starterCode: '// Solve within 40 minutes\n// your code here' },
    { id: 'd54q4', title: 'Resume Polish', difficulty: 'Easy', topic: 'Mock', starterCode: '// Review and polish resume\n// your code here' },
    { id: 'd54q5', title: 'Behavioral STAR Prep', difficulty: 'Easy', topic: 'Mock', starterCode: '// Prepare STAR stories\n// your code here' },
  ],
  55: [
    { id: 'd55q1', title: 'Final Revision — Weak Topics', difficulty: 'Easy', topic: 'Revision', starterCode: '// Review weak topics list\n// your code here' },
    { id: 'd55q2', title: 'Confidence Review', difficulty: 'Easy', topic: 'Revision', starterCode: '// Review progress\n// your code here' },
    { id: 'd55q3', title: 'Rest Day', difficulty: 'Easy', topic: 'Revision', starterCode: '// Light revision only\n// your code here' },
  ],
}

const DSA_TOPICS: Record<number, string> = {
  1: 'Maths (all) + Arrays Basics',
  2: 'Maths + Arrays Basics continued',
  3: 'Recursion — theory to Fibonacci',
  4: 'Recursion — advanced problems',
  5: 'Sorting — implement all 5 algorithms',
  6: 'Sorting — advanced problems',
  7: 'Hashing basics + Strings full',
  8: 'Arrays (linear search → rotations) + Matrix',
  9: 'Arrays Part 2 + Matrix operations',
  10: 'Two Pointers (Two Sum → LCS)',
  11: 'Two Pointers continued',
  12: 'Hashing/Prefix Sum + Binary Search intro',
  13: 'Binary Search — Search, Bounds, Insert',
  14: 'Binary Search — Koko, Cows, Books',
  15: 'Binary Search — Peak, Median, advanced',
  16: 'Backtracking — Subsets, Comb Sum',
  17: 'Backtracking — Word Search, N-Queens, Sudoku',
  18: 'Singly + Doubly Linked List basics',
  19: 'Linked List — cycle, palindrome, intersection',
  20: 'LL Logic Building — reverse K, flatten',
  21: 'LL Medium — sort, partition, odd-even',
  22: 'LL Hard — merge K, LRU, random pointer',
  23: 'Bit Manipulation',
  24: 'Greedy — Activity, Knapsack, Jobs',
  25: 'Greedy — Jump Game, Gas Station, Candy',
  26: 'Sliding Window — fixed + variable',
  27: 'Sliding Window — advanced problems',
  28: 'Stack/Queue Implementation + basic FAQs',
  29: 'Stack FAQs — histogram, RPN, collision',
  30: 'Stack/Queue FAQs Part 2 — LFU, sliding max',
  31: 'Binary Tree Traversal + basics',
  32: 'Binary Tree — diameter, balanced, symmetric',
  33: 'BT Medium + Construction + Morris',
  34: 'BST — validate, search, insert, kth smallest',
  35: 'BST — floor, ceil, two sum, serialize',
  36: 'Heaps — kth, top K, merge K, median stream',
  37: 'Trie — implement, word break, replace',
  38: 'Graph Traversal (BFS/DFS) + Cycles',
  39: 'Topological Sort + Bipartite + Islands',
  40: 'Shortest Path — Dijkstra, Bellman-Ford',
  41: 'Shortest Path — BFS variants, Word Ladder',
  42: 'MST + Disjoint Set Union',
  43: 'DP intro + Grid DP + Stocks I/II',
  44: 'Stocks III/IV + House Robber',
  45: 'DP Subsequences + 0/1 Knapsack',
  46: 'LIS + DP on Strings (LCS, LPS, Edit Distance)',
  47: 'DP on Strings — remaining',
  48: 'MCM DP + KMP/Z/Rabin-Karp',
  49: 'Segment/Fenwick basics + Maths primes + catch-up',
  50: 'LLD — SOLID, patterns, Parking Lot, Tic-Tac-Toe',
  51: 'LLD — Elevator, Strategy/Adapter/Decorator',
  52: 'LLD — LRU from scratch, HashMap, Twitter/Instagram',
  53: 'HLD — URL Shortener, Instagram, WhatsApp',
  54: 'Timed mocks + resume + behavioral STAR',
  55: 'Final light revision — weak topics only',
}

export function getDaySchedule(day: number): DaySchedule {
  const phase = getPhase(day)
  const fundamentals = getFundamentals(day)
  const revisionDays = getRevisionDays(day)
  const dsaTopic = DSA_TOPICS[day] || 'Review'
  const revisionTopics = revisionDays.length > 0
    ? revisionDays.map(d => `Day ${d}: ${DSA_TOPICS[d] || 'Review'}`).join(', ')
    : 'No revision today'

  return {
    dayNumber: day,
    date: getDateForDay(day),
    phase: phase.number,
    phaseName: phase.name,
    dsaTopic,
    fundamentalsTopic: fundamentals,
    revisionDays,
    blocks: createBlocks(dsaTopic, fundamentals, revisionTopics),
    questions: QUESTIONS[day] || [],
  }
}

export function getAllDays(): DaySchedule[] {
  return Array.from({ length: 55 }, (_, i) => getDaySchedule(i + 1))
}

export function getTodayDayNumber(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(PLAN_START_DATE)
  start.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, Math.min(55, diff + 1))
}

export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${minute.toString().padStart(2, '0')} ${period}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return `${mins}m ${secs}s`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hrs}h ${remMins}m`
}
