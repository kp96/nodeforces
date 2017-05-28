/**
 * @Author: Krishna Kalubandi <krishna>
 * @Date:   2017-05-27T15:05:10+05:30
 * @Email:  krishnakalubandi@gmail.com
 * @Filename: 811A.cpp
 * @Last modified by:   krishna
 * @Last modified time: 2017-05-27T15:06:28+05:30
 */

import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int st = 1;
        while(true) {
            if (st % 2 == 1) {
                a -= st;
                if (a < 0) {
                    System.out.println("Vladik");
                    return;
                }
            }
            else {
                b -= st;
                if (b < 0) {
                    System.out.println("Valera");
                    return;
                }
            }
            st++;
        }
    }
}
