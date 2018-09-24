# NEO Spammer

This script will spam NEO with free transactions. By default it will try to submit 100 transactions but can be modified to run as many as you want. Note that submitting many transactions can cause problems with the NEO network, such as unresponsive nodes and delayed block times. 

By default NEO will only accept 20 free transactions per block, and the rest will be queued in the mempool. This script _could_ be easily modified to pay for transactions and cause real issues since NEO lacks proper infrastructure for fees and fee estimates.

### Install

npm install

### Run

node spam_neo.js

### Issues

Some nodes will timeout 

### Monitor Spam

You can view transactions on NEO block explorers like [NeoScan](https://neoscan.io/) or [NeoTracker](https://neotracker.io/)
