#include <fstream>
#include <iostream>
#include <string>

using namespace std;


int main(int argc, char* args[]) {
    // Check for Required Arguments (2 Arguments Requried)
    if(argc == 1 || argc < 3) {
        cout << "Invalid Arguments!\n" <<
            "Please enter [line#] and [string to replace with]\n";
        return 1;
    }

    // Obtain the Required Arguments
    int lineNum = *args[1] - '0';
    string repStr = args[2];


    // Setup File input output
    string buffer;
    ifstream in("in.txt");
    ofstream out("out.txt");

    // Make sure Files Loaded Properly
    if(!in || !out) {
        cout << "Files not found!\n";
        cout << "Please have an 'in.txt' to read from\n";
        cout << "Result will be stored in 'out.txt'\n";
        return 2;
    }


    int i = 1;
    bool lineFound = false;
    while(getline(in, buffer)) {
        // Find Line & Modify Data
        if(lineNum == i) {
            lineFound = true;
            buffer = repStr;
        }

        // Add to output file
        // Increment Line Counter
        out << buffer << endl;
        i++;
    } 


    // Check if Line Number was found
    if(!lineFound) {
        cout << "Line was not found!" << endl;
        return 2;
    }

    // Successul
    cout << "Line " << lineNum << ": Replaced with '" << repStr << "'\n";
    return 0;
}
