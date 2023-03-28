const {
  convertTimestampToDate,
  createRef,
  formatComments,
  checkDescendingOrder,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with a single items", () => {
    const input = [{ title: "title1", article_id: 1, name: "name1" }];
    let actual = createRef(input, "title", "article_id");
    let expected = { title1: 1 };
    expect(actual).toEqual(expected);
    actual = createRef(input, "name", "title");
    expected = { name1: "title1" };
    expect(actual).toEqual(expected);
  });
  test("returns a reference object when passed an array with many items", () => {
    const input = [
      { title: "title1", article_id: 1 },
      { title: "title2", article_id: 2 },
      { title: "title3", article_id: 3 },
    ];
    const actual = createRef(input, "title", "article_id");
    const expected = { title1: 1, title2: 2, title3: 3 };
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input", () => {
    const input = [{ title: "title1", article_id: 1 }];
    const control = [{ title: "title1", article_id: 1 }];
    createRef(input);
    expect(input).toEqual(control);
  });
});

describe("formatComments", () => {
  test("returns an empty array, if passed an empty array", () => {
    const comments = [];
    expect(formatComments(comments, {})).toEqual([]);
    expect(formatComments(comments, {})).not.toBe(comments);
  });
  test("converts created_by key to author", () => {
    const comments = [{ created_by: "ant" }, { created_by: "bee" }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].author).toEqual("ant");
    expect(formattedComments[0].created_by).toBe(undefined);
    expect(formattedComments[1].author).toEqual("bee");
    expect(formattedComments[1].created_by).toBe(undefined);
  });
  test("replaces belongs_to value with appropriate id when passed a reference object", () => {
    const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
    const ref = { title1: 1, title2: 2 };
    const formattedComments = formatComments(comments, ref);
    expect(formattedComments[0].article_id).toBe(1);
    expect(formattedComments[1].article_id).toBe(2);
  });
  test("converts created_at timestamp to a date", () => {
    const timestamp = Date.now();
    const comments = [{ created_at: timestamp }];
    const formattedComments = formatComments(comments, {});
    expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
  });
});

describe("checkDescendingOrder", () => {
  test("returns true if passed a one item array", () => {
    expect(checkDescendingOrder([1])).toBe(true);
  });
  test("returns false if passed an array in ascending order", () => {
    expect(checkDescendingOrder([1, 2, 3])).toBe(false);
  });
  test("returns true if passed an array in descending order", () => {
    expect(checkDescendingOrder([(3, 2, 1)])).toBe(true);
  });
  test("returns false if passed an array of numbers as strings, in ascending order", () => {
    expect(checkDescendingOrder(["1", "2", "3"])).toBe(false);
  });
  test("returns true if passed an array of numbers as strings, in descending order", () => {
    expect(checkDescendingOrder(["3", "2", "1"])).toBe(true);
  });
  test("returns true if passed an array of numbers in descending order, with repeated values", () => {
    expect(checkDescendingOrder(["3", "3", "2", "2", "1"])).toBe(true);
    expect(checkDescendingOrder([3, 3, 2, 2, 1])).toBe(true);
  });
  test("returns true if passed a large array of numbers in descending order", () => {
    const inputArray = [
      1968, 1937, 1927, 1915, 1881, 1849, 1838, 1773, 1691, 1644, 1587, 1519,
      1481, 1477, 1428, 1392, 1323, 1299, 1298, 1246, 1181, 1153, 1142, 1136,
      1124, 1049, 1036, 1027, 1011, 971, 960, 741, 735, 732, 725, 723, 629, 529,
      512, 488, 412, 395, 374, 365, 289, 196, 144, 97, 18,
    ];
    expect(checkDescendingOrder(inputArray)).toBe(true);
  });
  test("returns false if passed a large array of numbers not in descending order", () => {
    const inputArray = [
      21, 64, 98, 108, 119, 131, 406, 472, 482, 504, 524, 574, 607, 678, 726,
      818, 875, 897, 975, 1075, 1079, 1118, 1246, 1259, 1370, 1397, 1403, 1430,
      1449, 1455, 1479, 1485, 1486, 1505, 1540, 1644, 1664, 1704, 1716, 1730,
      1770, 1779, 1799, 1815, 1863, 1924, 1944, 1960, 1967, 1988,
    ];
    expect(checkDescendingOrder(inputArray)).toBe(false);
  });
});
