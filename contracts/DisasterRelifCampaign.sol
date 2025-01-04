// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DisasterRelifCampaign{
    struct Campaign{
        address creator; 
        string title; 
        string description; 
        uint256 targetAmount; 
        uint256 raisedAmount; 
        uint256 releasedAmount; 
        bool isActive; 
        uint256 lastReleaseTime; 
    }


    struct WithdrawalRequest{ 
        uint256 amount; 
        string reason ; 
        uint256 requestTime; 
        bool approved; 
    }


    mapping(uint256 => Campaign) public campaigns; 
    mapping (uint256 => WithdrawalRequest[]) public withdrawalRequests; 
    uint256 public campaignCount; 

    uint256 public constant RELEASE_DELAY = 3 days; 
    uint256 public constant MAX_WITHDRAWAL_PERCENT = 30; //30 per withdrawl

    event CampaignCreated(uint256 campainId, address creator, string title);
    event DonationReceived(uint256 campaignId, address donor, uint256 amount);
    event WithdrawalRequested(uint256 campaignId, uint256 amount, string reason); 
    event FundsReleased(uint256 campaignId, uint256 amount);

    function createCampaign (string memory _title, string memory _description ,uint256 _targetAmount) public{ 
        Campaign memory newCampaign = Campaign({
            creator:msg.sender, 
            title:_title, 
            description: _description, 
            targetAmount:_targetAmount, 
            raisedAmount : 0, 
            releasedAmount: 0, 
            isActive:true, 
            lastReleaseTime : block.timestamp 
        }); 

    campaigns[campaignCount] = newCampaign; 
    emit CampaignCreated(campaignCount, msg.sender, _title);
    campaignCount++; 
    }


    function donate(uint256 _campaignId) public payable{
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active"); 

        campaign.raisedAmount +=msg.value; 
        emit DonationReceived(_campaignId, msg.sender, msg.value); 

        if (campaign.raisedAmount >=campaign.targetAmount){
             campaign.isActive = false; 
        } 
    }

function requestWithdrawal(
    uint256 _campaignId, 
    uint256 _amount, 
    string memory _reason
) public { 
    Campaign storage campaign  = campaigns[_campaignId];

    require(msg.sender==campaign.creator, "only creator can request "); 
    require(block.timestamp>=campaign.lastReleaseTime + RELEASE_DELAY,"Too soon for next withdrawal"); 
    uint256 availableFunds = campaign.raisedAmount - campaign.releasedAmount; 
    uint maxWithdrawal  = (availableFunds * MAX_WITHDRAWAL_PERCENT)/100;

    require(_amount <=maxWithdrawal ,"Amount exceeds maximum withdrawal limit"); 
    WithdrawalRequest memory newRequest = WithdrawalRequest({
        amount:_amount, 
        reason:_reason, 
        requestTime: block.timestamp, 
        approved:false
    });

    withdrawalRequests[_campaignId].push(newRequest); 
    emit WithdrawalRequested(_campaignId, _amount, _reason);
}

    function releaseWithdrawal(uint256 _campaignId, uint256 _requestIndex) public{
        Campaign storage campaign = campaigns[_campaignId];
        WithdrawalRequest storage request = withdrawalRequests[_campaignId][_requestIndex]; 

        require(msg.sender==campaign.creator, "only creator can release"); 
        require(!request.approved, "Already approved"); 
        require(block.timestamp>=request.requestTime + 1 days, "24h delay not met");

        request.approved = true; 
        campaign.releasedAmount +=request.amount; 
        campaign.lastReleaseTime = block.timestamp; 

        payable(campaign.creator).transfer(request.amount); 
        emit FundsReleased(_campaignId, request.amount); 


    }


    function getCampaign(uint256 _campaignId) public view returns(
        address creator, 
        string memory title, 
        string memory description, 
        uint256 targetAmount, 
        uint256 raisedAmount, 
        uint256 relesasedAmount, 
        bool isActive 
    ){
        Campaign memory campaign = campaigns[_campaignId]; 
        return (
            campaign.creator, 
            campaign.title, 
            campaign.description, 
            campaign.targetAmount, 
            campaign.raisedAmount, 
            campaign.releasedAmount, 
            campaign.isActive
        );
    }
}