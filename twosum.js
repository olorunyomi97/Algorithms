<?php

class Solution {

    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer[]
     */
    function twoSum($nums, $target) {
         // Brute Force Method
        $new_nums = $nums;
        
        for ($i = 0; $i < count($nums); $i++) {
            $biggie = $target - $nums[$i];
            unset($new_nums[$i]);
            
            if($key = array_search($biggie, $new_nums)) {
                return [$i, $key];
            }
        }   
    }
}
