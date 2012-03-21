c=[['a','b','c'],['d','e','f'],['g','h','i']]
csmall=[['a','b'],['c','d']]
used=[[False for i in range(3)] for j in range(3)]
usedsmall = [[False for i in range(2)] for j in range(2)]

def find_permutations(r, c, chars, width, height):
    used=[[False for i in range(width)] for j in range(height)]
    used[r][c] = True
    cumul_string = chars[r][c]
    cumul_result = [chars[r][c]]

    find_permutations_helper(r, c, chars, used, width, height, cumul_string, cumul_result)
    return cumul_result

def find_permutations_helper(r, c, chars, used, width, height, cumul_string, cumul_result):

    valid_neighbors = find_unused_neighbors(r, c, chars, used, width, height)

    usedcopy = [[x[y] for y in range(width)] for x in used]
    usedcopy[r][c] = True

    for neighbor in valid_neighbors:
        cumul_result.append(cumul_string + chars[neighbor[0]][neighbor[1]])
        copy = cumul_string + chars[neighbor[0]][neighbor[1]]
        find_permutations_helper(neighbor[0], neighbor[1], chars, usedcopy, width, height, copy, cumul_result)

def find_unused_neighbors(r, c, chars, used, width, height):
    rc = (r,c);
    result = []
    for y in [-1,0,1]:
        for x in [-1,0,1]:
            if (y == 0 and x == 0):
                continue
            curr_r = r + y;
            curr_c = c + x;
            if (curr_r >= 0 and curr_r < height):
                if (curr_c >= 0 and curr_c < width):
                    if (not used[curr_r][curr_c]):
                        result.append((curr_r,curr_c))
    return result
