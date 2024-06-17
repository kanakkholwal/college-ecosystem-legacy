import mongoose from 'mongoose';
import ResultModel from 'src/models/result';


const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
const opts = {
    dbName,
};
mongoose.connect(`${MONGODB_URI} + "?retryWrites=true&w=majority&appName=nith"`, opts)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Fetch all results
        const results = await ResultModel.find({}, null, {
            sort: {
                'semesters.-1.cgpi': -1,
            },
        }).collation({ locale: 'en' });

        console.log("Total results: ", results.length)

        // Calculate ranks
        const updatePromises = results
        .toSorted((a, b) => b.semesters[b.semesters.length - 1].cgpi - a.semesters[a.semesters.length - 1].cgpi)
        .map(async (result, index) => {
            const latestCGPI = result.semesters[result.semesters.length - 1].cgpi;
            const batch = result.batch;
            const branch = result.branch;

            // Calculate college rank
            const collegeRank = index + 1;
            console.log("collegeRank : ", collegeRank);
            // Calculate batch rank
            const batchResults = results.filter(r => r.batch === batch);
            const batchRank = batchResults.findIndex(r => r.semesters[r.semesters.length - 1].cgpi === latestCGPI) + 1;
            console.log("batchRank : ", batchRank);
            // Calculate branch rank
            const branchResults = batchResults.filter(r => r.branch === branch);
            const branchRank = branchResults.findIndex(r => r.semesters[r.semesters.length - 1].cgpi === latestCGPI) + 1;
            console.log("branchRank : ", branchRank);
            // Calculate class rank
            const classResults = branchResults;
            const classRank = classResults.findIndex(r => r.semesters[r.semesters.length - 1].cgpi === latestCGPI) + 1;
            console.log("classRank : ", classRank);
            // Update the document
            return ResultModel.updateOne({ _id: result._id }, {
                $set: {
                    'rank.college': collegeRank,
                    'rank.batch': batchRank,
                    'rank.branch': branchRank,
                    'rank.class': classRank,
                }
            });
        });

        // Wait for all updates to complete
        const response = await Promise.allSettled(updatePromises);

        const failedUpdates = response.filter(r => r.status === 'rejected');

        console.dir('Some updates failed:', failedUpdates.length, failedUpdates);

        console.log('Ranks updated successfully ',results.length - failedUpdates.length);
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error:', err);
        mongoose.disconnect();
    });