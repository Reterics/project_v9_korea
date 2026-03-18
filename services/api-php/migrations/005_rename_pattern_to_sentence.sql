-- Rename item_kind 'pattern' to 'sentence' in progress table
-- to match the frontend StudyItemRef type change

UPDATE progress SET item_kind = 'sentence' WHERE item_kind = 'pattern';
