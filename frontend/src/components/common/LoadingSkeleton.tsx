import {
  Grid,
  Card,
  CardContent,
  Skeleton,
  Box,
} from "@mui/material";

const LoadingSkeleton = () => {
  return (
    <Grid
      container
      spacing={3}
      sx={{ mt: 2 }}
    >
      {[1, 2, 3].map((item) => (
        <Grid
          key={item}
          size={{
            xs: 12,
            sm: 6,
            lg: 4,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              height: 320,
            }}
          >
            <CardContent>
              <Skeleton
                width="30%"
                height={25}
              />

              <Skeleton
                width="60%"
                height={50}
              />

              <Box mt={2}>
                <Skeleton
                  width="40%"
                  height={60}
                />
              </Box>

              <Box mt={3}>
                <Skeleton
                  width="90%"
                  height={30}
                />

                <Skeleton
                  width="80%"
                  height={30}
                />

                <Skeleton
                  width="85%"
                  height={30}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;